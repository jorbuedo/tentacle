import crypto from 'node:crypto'
import { delay } from './utils'

// Public/Private method names
export enum PublicMethod {
  'Time' = 'Time',
  'Assets' = 'Assets',
  'AssetPairs' = 'AssetPairs',
  'Ticker' = 'Ticker',
  'Depth' = 'Depth',
  'Trades' = 'Trades',
  'Spread' = 'Spread',
  'OHLC' = 'OHLC',
}
export enum PrivateMethod {
  'Balance' = 'Balance',
  'TradeBalance' = 'TradeBalance',
  'OpenOrders' = 'OpenOrders',
  'ClosedOrders' = 'ClosedOrders',
  'QueryOrders' = 'QueryOrders',
  'TradesHistory' = 'TradesHistory',
  'QueryTrades' = 'QueryTrades',
  'OpenPositions' = 'OpenPositions',
  'Ledgers' = 'Ledgers',
  'QueryLedgers' = 'QueryLedgers',
  'TradeVolume' = 'TradeVolume',
  'AddOrder' = 'AddOrder',
  'CancelOrder' = 'CancelOrder',
  'DepositMethods' = 'DepositMethods',
  'DepositAddresses' = 'DepositAddresses',
  'DepositStatus' = 'DepositStatus',
  'WithdrawInfo' = 'WithdrawInfo',
  'Withdraw' = 'Withdraw',
  'WithdrawStatus' = 'WithdrawStatus',
  'WithdrawCancel' = 'WithdrawCancel',
  'GetWebSocketsToken' = 'GetWebSocketsToken',
}

// Default options
const defaults = {
  url: 'https://api.kraken.com',
  version: 0,
  max_requests: 3,
  results_per_page: 50,
}
const encoder = new TextEncoder()

const binaryStringToUint8Array = (str: string) =>
  Uint8Array.from(str, (c) => c.charCodeAt(0))

// Refer to https://docs.kraken.com/rest/ for possible any values
type Params = Record<string, any>

type MessageSignatureParams = {
  path: string
  params: Params
  secret: string
  nonce: number
}

// Create a signature for a request
const getMessageSignature = async ({
  path,
  params,
  secret,
  nonce,
}: MessageSignatureParams) => {
  const message = new URLSearchParams(params).toString()

  const hashedMessage = String.fromCharCode(
    ...new Uint8Array(
      await crypto.subtle.digest(
        'SHA-256',
        encoder.encode(`${nonce}${message}`)
      )
    )
  )

  const key = await crypto.subtle.importKey(
    'raw',
    binaryStringToUint8Array(atob(secret)),
    { name: 'HMAC', hash: 'SHA-512' },
    false,
    ['sign']
  )

  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    binaryStringToUint8Array(`${path}${hashedMessage}`)
  )

  return btoa(String.fromCharCode(...new Uint8Array(signature)))
}

type RawRequestParams = {
  url: string
  headers?: Record<string, string>
  params?: Params
}

type KrakenResponse = {
  result: Record<string, any>
  error: Array<string>
}

// Send an API request
const rawRequest = async ({
  url,
  headers = {},
  params = {},
}: RawRequestParams) => {
  const response = await fetch(url, {
    method: 'POST',
    body: new URLSearchParams(params).toString(),
    headers: {
      'User-Agent': 'Kraken Javascript API Client',
      'Content-Type': 'application/x-www-form-urlencoded',
      ...headers,
    },
  })

  if (!response.ok) {
    throw new Error('Network response was not ok')
  }

  const body = (await response.json()) as KrakenResponse

  if (body.error && body.error.length) {
    const error = body.error
      .filter((e) => e.startsWith('E'))
      .map((e) => e.slice(1))

    if (!error.length) {
      throw new Error('Kraken API returned an unknown error')
    }

    throw new Error(error.join(', '))
  }
  return body.result
}

type CreateApiParams = { key: string; secret: string }

type KrakenApiParams = {
  method: PublicMethod | PrivateMethod | string
  params?: Params
}

export const createApi = ({ key, secret }: CreateApiParams) => {
  const publicMethod = (method: PublicMethod, params: Params = {}) => {
    return rawRequest({
      url: `${defaults.url}/${defaults.version}/public/${method}`,
      params,
    })
  }

  const privateMethod = async (method: PrivateMethod, _params: Params = {}) => {
    const path = `/${defaults.version}/private/${method}`
    const nonce = Date.now()
    const params = { nonce, ..._params }

    const signature = await getMessageSignature({
      path,
      params,
      secret,
      nonce,
    })

    const headers = {
      'API-Key': key,
      'API-Sign': signature,
    }
    return rawRequest({
      url: `${defaults.url}${path}`,
      params,
      headers,
    })
  }

  return async ({ method, params = {} }: KrakenApiParams) => {
    let result: ReturnType<typeof rawRequest>
    if (Object.values(PublicMethod).includes(method as PublicMethod)) {
      result = publicMethod(method as PublicMethod, params)
    } else if (Object.values(PrivateMethod).includes(method as PrivateMethod)) {
      result = privateMethod(method as PrivateMethod, params)
    } else {
      throw new Error(method + ' is not a valid API method.')
    }

    return result
  }
}

type MethodsWithOffset =
  | PrivateMethod.ClosedOrders
  | PrivateMethod.TradesHistory
  | PrivateMethod.Ledgers

const getMethodsWithOffsetSelector = (method: MethodsWithOffset) =>
  ({
    [PrivateMethod.ClosedOrders]: 'closed',
    [PrivateMethod.TradesHistory]: 'trades',
    [PrivateMethod.Ledgers]: 'ledger',
  }[method])

type PageOffsetsParams = {
  count?: number
  ofs?: number
}

const getPageOffsets = ({ count = 0, ofs = 0 }: PageOffsetsParams) => {
  const totalPages = Math.ceil(count / defaults.results_per_page)
  const currentPage = Math.ceil(ofs / defaults.results_per_page)
  const offsets =
    currentPage === totalPages
      ? []
      : Array.from(Array(totalPages - currentPage)).map(
          (_, i) => (i + currentPage) * defaults.results_per_page
        )

  return { totalPages, currentPage, offsets }
}

type AllDataParams = {
  api: ReturnType<typeof createApi>
  method: MethodsWithOffset
  params?: Record<string, any>
  callback?: (a: any) => void
  selector?: string
  rateLimitTimeout?: number
}
/**
 * Makes all necesarry requests for ClosedOrders, TradesHistory or Ledgers.
 * It can take some time since it waits between requests when rate limited.
 * Invokes callback for every partial result.
 * Returns a result with the all the results merged, and the count.
 */
export const getAllData = async ({
  api,
  method,
  params = {},
  callback = () => null,
  selector = getMethodsWithOffsetSelector(method),
  rateLimitTimeout = 61_000,
}: AllDataParams) => {
  const time = Date.now() / 1000
  const { ofs = 0, end = time, ...restParams } = params
  // There's a bug in Kraken API where ClosedOrders with ofs=0 always returns count=0
  const adjustedOfs =
    method === PrivateMethod.ClosedOrders && ofs === 0 ? -1 : ofs

  const { [selector]: firstResult, count } = await api({
    method,
    params: { ofs: adjustedOfs, end, ...restParams },
  })

  callback(firstResult)

  const { totalPages, currentPage, offsets } = getPageOffsets({ count, ofs })

  if (currentPage === totalPages) {
    return { result: firstResult, count }
  }

  const allResults = Object.assign({}, firstResult)

  for (let i = 0; i < offsets.length; i++) {
    try {
      const { [selector]: result } = await api({
        method,
        params: { ofs: offsets[i], end, ...restParams },
      })
      callback(result)
      Object.assign(allResults, result)
    } catch (err: any) {
      if (err.message === 'API:Rate limit exceeded') {
        await delay(rateLimitTimeout)
        i--
      } else {
        throw err
      }
    }
  }

  return { result: allResults, count }
}

export const getAllPairTicker = async (api: ReturnType<typeof createApi>) => {
  const assetPairs = await api({ method: PublicMethod.AssetPairs })
  const simplifiedAssetPairs = Object.entries(assetPairs).map(
    ([name, { base, quote }]) => ({ name, base, quote })
  )
  const pair = Object.keys(assetPairs)
  const ticker = await api({ method: PublicMethod.Ticker, params: { pair } })
  const simplifiedTicker = Object.entries(ticker).reduce(
    (acc, [name, value]) => ((acc[name] = value.a[0]), acc),
    {} as Record<string, string>
  )

  return { assetPairs, simplifiedAssetPairs, ticker, simplifiedTicker }
}
