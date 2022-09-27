import { initView, view } from './model'
import { initDb } from './model/database'
import { initKrakenApi, updateAll } from './model/krakenApi'

// Top level await not supported on cjs
;(async () => {
  initView()
  try {
    initDb()
    await initKrakenApi()
    view.setState({ isModelReady: true })
    await updateAll()
  } catch (err) {
    view.error('Error on init: ', err)
  }
})()
