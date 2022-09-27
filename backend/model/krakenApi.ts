import { throttledQueue } from '../lib/utils'
import {
  createApi,
  getAllData,
  getAllPairTicker,
  PrivateMethod,
  PublicMethod,
} from '../lib/kraken'
import { db } from './database'
import { getItem, setItem } from './kvStorage'
import getNeedsPriceHistoryQuery from '../sql/getNeedsPriceHistory.sql?raw'
import { view } from '.'

const KV_KEY = 'kraken_api_key'
const KV_SECRET = 'kraken_api_secret'

type CreateApiParams = Parameters<typeof createApi>[0]

export let krakenApi = createApi({ key: '', secret: '' })

export const hasKrakenKey = async () => {
  const key = await getItem(KV_KEY, false)
  const secret = await getItem(KV_SECRET, false)

  return Boolean(key) && Boolean(secret)
}

export const initKrakenApi = async () => {
  try {
    const key = await getItem(KV_KEY, false)
    const secret = await getItem(KV_SECRET, false)

    if (key && secret) {
      krakenApi = createApi({ key, secret })
      view.setState({ hasApiKey: true })
    }
  } catch (err) {
    view.error('Error initializing Kraken api', err)
  }
}

export const updateKrakenApiKey = async ({ key, secret }: CreateApiParams) => {
  try {
    await setItem(KV_KEY, key, false)
    await setItem(KV_SECRET, secret, false)

    krakenApi = createApi({ key, secret })
    view.setState({ hasApiKey: await hasKrakenKey() })
  } catch (err) {
    view.error('Error updating Kraken api key', err)
  }
}

export const insertAssetPairs = (assetPairs: Array<Record<string, any>>) => {
  db.exec('BEGIN TRANSACTION')
  const stmt = db.prepare(`
    REPLACE INTO assetPairs (name, base, quote) VALUES (?, ?, ?)
  `)
  assetPairs.forEach(({ name, base, quote }) => stmt.run([name, base, quote]))
  db.exec('COMMIT')
  stmt.finalize()
}

export const insertAssetPairsPrices = (
  assetPairsPrices: Record<string, string>
) => {
  db.exec('BEGIN TRANSACTION')
  const stmt = db.prepare(`
    UPDATE assetPairs SET price = ? WHERE name = ?;
  `)
  Object.entries(assetPairsPrices).forEach(([name, price]) =>
    stmt.run([price, name])
  )
  db.exec('COMMIT')
  stmt.finalize()
}

export const insertPriceHistory = (priceHistory: Record<string, any>) => {
  db.exec('BEGIN TRANSACTION')
  const stmt = db.prepare(`
    REPLACE INTO priceHistory (pair, time, price) VALUES (?, ?, ?)
  `)
  Object.entries(priceHistory).forEach(([pair, data]) => {
    data.forEach(([time, price]: any) => {
      stmt.run([pair, time, price])
    })
  })
  db.exec('COMMIT')
  stmt.finalize()
}

export const insertLedgers = (ledgers: Record<string, any>) => {
  view.log('ledgers insert')
  db.exec('BEGIN TRANSACTION')
  const stmt = db.prepare(`
    REPLACE INTO ledgers (id, refid, time, type, subtype, aclass, asset, amount, fee, balance) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)
  Object.entries(ledgers).forEach(
    ([
      id,
      { refid, time, type, subtype, aclass, asset, amount, fee, balance },
    ]) =>
      stmt.run([
        id,
        refid,
        time,
        type,
        subtype,
        aclass,
        asset,
        amount,
        fee,
        balance,
      ])
  )
  db.exec('COMMIT')
  stmt.finalize()
}

export const updateAssetPairs = async (forceUpdate: boolean = false) => {
  const now = Date.now() / 1000
  const lastUpdate = await getItem('krakenAssetPairsLastUpdate')
  const staleTimeout = 5400

  const shouldUpdate =
    forceUpdate || !lastUpdate || lastUpdate + staleTimeout < now

  if (!shouldUpdate) {
    return false
  }

  const { simplifiedAssetPairs, simplifiedTicker } = await getAllPairTicker(
    krakenApi
  )
  insertAssetPairs(simplifiedAssetPairs)
  insertAssetPairsPrices(simplifiedTicker)

  await setItem('krakenAssetPairsLastUpdate', now)

  return true
}

export const updateLedgers = async (forceUpdate: boolean = false) => {
  const now = Date.now() / 1000
  const lastUpdate = await getItem('krakenLedgersLastUpdate')
  const staleTimeout = 3600

  const shouldUpdate =
    forceUpdate || !lastUpdate || lastUpdate + staleTimeout < now

  if (!shouldUpdate) {
    return false
  }

  await getAllData({
    api: krakenApi,
    method: PrivateMethod.Ledgers,
    params: { start: lastUpdate ?? 0, end: now },
    callback: insertLedgers,
  })

  await setItem('krakenLedgersLastUpdate', now)

  return true
}

export const updateRelevantPriceHistory = async () => {
  const queue = throttledQueue(1, 500)

  db.each(getNeedsPriceHistoryQuery, (_, { name, time }) => {
    const fn = async () => {
      view.log(`Updating price for ${name}-${time}`)
      const { [name]: list } = await krakenApi({
        method: PublicMethod.Trades,
        params: { pair: name, since: time },
      })
      const [price] = list[0]

      db.run('REPLACE INTO priceHistory (pair, time, price) VALUES (?, ?, ?)', [
        name,
        time,
        price,
      ])
    }
    queue(fn)
  })
}

export const updateAll = async () => {
  view.setState({ isDataUpdating: true })

  try {
    await updateAssetPairs()

    if (await hasKrakenKey()) {
      await updateLedgers()
    }

    await updateRelevantPriceHistory()
  } catch (err) {
    throw err
  } finally {
    view.setState({ isDataUpdating: false })
  }
}
