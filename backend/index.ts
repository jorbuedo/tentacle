import { initView, view } from './model'
import { initDb } from './model/database'
import {
  hasKrakenKey,
  initKrakenApi,
  updateAssetPairs,
  updateLedgers,
  updateRelevantPriceHistory,
} from './model/krakenApi'

// Top level await not supported on cjs
;(async () => {
  initView()
  try {
    initDb()
    await initKrakenApi()
    view.setState({ isModelReady: true, isDataUpdating: true })
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
  } catch (err) {
    view.error('Error on init: ', err)
  }
})()
