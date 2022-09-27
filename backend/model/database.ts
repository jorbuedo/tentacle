import path from 'node:path'
import { mkdirSync } from 'node:fs'
import { homedir } from 'node:os'
import { Database, RunResult, Statement } from 'sqlite3'
import { errorBack } from './utils'
import createKV from '../sql/createKV.sql?raw'
import createLedgers from '../sql/createLedgers.sql?raw'
import createAssetPairs from '../sql/createAssetPairs.sql?raw'
import createPriceHistory from '../sql/createPriceHistory.sql?raw'
import viewFiat from '../sql/viewFiat.sql?raw'
import viewTransactions from '../sql/viewTransactions.sql?raw'
import viewSales from '../sql/viewSales.sql?raw'
import viewHodl from '../sql/viewHodl.sql?raw'

export let db: Database

export const initDb = (filename: string = 'data.db') => {
  const homePath = path.join(homedir(), '.tentacle')
  mkdirSync(homePath, { recursive: true })
  const dbPath = path.join(homePath, filename)

  db?.close(errorBack)
  db = new Database(dbPath, errorBack)
  db.exec(createKV)
  db.exec(createLedgers)
  db.exec(createAssetPairs)
  db.exec(createPriceHistory)
  db.exec(viewFiat)
  db.exec(viewTransactions)
  db.exec(viewSales)
  db.exec(viewHodl)
}

export const getAll = async <T>(sql: string, params?: any) => {
  return new Promise<Array<T>>((resolve, reject) => {
    function callback(this: Statement, err: Error | null, rows: Array<T>) {
      if (err) {
        reject(err)
      } else {
        resolve(rows)
      }
    }

    if (params !== undefined) {
      db.all(sql, params, callback)
    } else {
      db.all(sql, callback)
    }
  })
}

export const run = async (sql: string, params?: any) => {
  return new Promise((resolve, reject) => {
    function callback(this: RunResult, err: Error | null) {
      if (err) {
        reject(err)
      } else {
        resolve(this)
      }
    }

    if (params !== undefined) {
      db.run(sql, params, callback)
    } else {
      db.run(sql, callback)
    }
  })
}

export const get = async <T>(sql: string, params?: any) => {
  return new Promise<T>((resolve, reject) => {
    function callback(this: Statement, err: Error | null, row: T) {
      if (err) {
        reject(err)
      } else {
        resolve(row)
      }
    }

    if (params !== undefined) {
      db.get(sql, params, callback)
    } else {
      db.get(sql, callback)
    }
  })
}
