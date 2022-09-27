import { createStore } from 'solid-js/store'

const initialState = {
  isModelReady: false,
  isDataUpdating: false,
  hasApiKey: false,
}

export const [state, setState] = createStore(initialState)
