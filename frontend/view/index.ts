import { Child, Command } from '@tauri-apps/api/shell'
import { BirpcReturn, createBirpc } from 'birpc'
import type { ModelFunctions } from '~b/model/interface'
import * as View from '../view/functions'

export let model: BirpcReturn<ModelFunctions>

type InitModelArgs = {
  command: Command
  child: Child
}

export const initModel = ({ command, child }: InitModelArgs) => {
  model = createBirpc<ModelFunctions>(View, {
    serialize: JSON.stringify,
    deserialize: JSON.parse,
    post: (data) => child.write(data),
    on: (fn) => command.stdout.on('data', fn),
    eventNames: ['updateLedgers', 'updateAll'],
  })
  return model
}
