import { Component } from 'solid-js'
import { state } from '~/view/state'

const Footer: Component = () => {
  return (
    <footer class="flex justify-end bg-sky-600 py-1 px-4 text-xs  text-white">
      {state.isDataUpdating ? 'Updating...' : 'Ready'}
    </footer>
  )
}

export default Footer
