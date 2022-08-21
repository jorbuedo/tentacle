import NProgress from 'nprogress'
import { createEffect } from 'solid-js'
import { isServer } from 'solid-js/web'
import { state } from '~/view/state'

export const install = () => {
  if (isServer) return

  createEffect(() => {
    if (state.isDataUpdating) {
      NProgress.start()
    } else {
      NProgress.done()
    }
  })
}
