import { Link } from '@solidjs/router'
import { Component, JSX } from 'solid-js'
import { model } from '~/view'
import { state } from '~/view/state'

type FooterProps = {
  class?: string
}

const Footer: Component<FooterProps> = (props) => {
  const handleUpdate: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (e) => {
    e.preventDefault()
    model.updateAll()
  }

  return (
    <footer
      classList={{ [props.class ?? '']: true }}
      class="flex justify-end space-x-2 bg-sky-600 py-1 px-4  text-xs text-white"
    >
      <Link href="/accounts">Accounts</Link>
      <Link href="/balance">Balance</Link>
      <Link href="/capital-gains">Capital Gains</Link>
      <button onClick={handleUpdate}>⟳</button>
      {state.isDataUpdating ? 'Updating...' : 'Ready'}
    </footer>
  )
}

export default Footer
