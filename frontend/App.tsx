import { Component, onMount, Show } from 'solid-js'
import { useRoutes } from '@solidjs/router'
import { state } from './view/state'
import { routes } from './routes'
import Footer from './components/Footer'

const App: Component = () => {
  onMount(() => {
    // Install modules
    Object.values(import.meta.glob('./modules/*.ts', { eager: true })).forEach(
      (i: any) => i.install?.()
    )
  })

  // Configure routes
  const Route = useRoutes(routes)

  return (
    <Show when={state.isModelReady} fallback={<div>Loading app...</div>}>
      <main id="main-content">
        <Route />
      </main>
      <Footer class="fixed bottom-0 w-full" />
    </Show>
  )
}

export default App
