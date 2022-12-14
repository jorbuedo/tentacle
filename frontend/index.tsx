/* @refresh reload */
import './styles/index.css'
import './styles/main.css'
import './styles/table.css'
import { render } from 'solid-js/web'
import { Router } from '@solidjs/router'

import App from './App'

render(
  () => (
    <Router>
      <App />
    </Router>
  ),
  document.getElementById('root') as HTMLElement
)
