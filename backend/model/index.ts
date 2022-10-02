import { BirpcReturn, createBirpc } from 'birpc'
import type { ViewFunctions } from '~/view/interface'
import { deserialize, serialize } from '~b/lib/utils'
import * as Model from './functions'

export let view: BirpcReturn<ViewFunctions>

export const initView = () => {
  const stdin = process.stdin
  stdin.resume()
  stdin.setEncoding('utf-8')

  view = createBirpc<ViewFunctions>(Model, {
    serialize,
    deserialize,
    post: (data) => console.log(data),
    on: (fn) => stdin.on('data', fn),
    eventNames: ['setState', 'log', 'error'],
  })

  return view
}
