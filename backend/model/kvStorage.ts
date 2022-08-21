import { db, get, run } from './database'
import createKV from '../sql/createKV.sql?raw'
import { deserialize, serialize } from '~b/lib/utils'

export const setItem = async (key: string, value: any, stringify = true) => {
  return run('REPLACE INTO kv (key, value) VALUES (?, ?);', [
    key,
    stringify ? serialize(value) : value,
  ])
}

export const getItem = async (key: string, parse = true) => {
  const result = (await get('SELECT value FROM kv WHERE key = ?;', [
    key,
  ])) as any
  const value = result?.value ?? null
  return parse ? deserialize((value as string) ?? null) : value
}

export const removeItem = async (key: string) => {
  return run('DELETE FROM kv WHERE key = ?;', [key])
}

export const clear = async () => {
  db.exec('DROP TABLE IF EXISTS kv;')
  db.exec(createKV)
}
