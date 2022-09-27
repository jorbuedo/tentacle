import { Show } from 'solid-js'
import { useNavigate } from '@solidjs/router'
import { model } from '~/view'
import Card from '~/components/Card'
import { state } from '~/view/state'

export default function Account() {
  const navigate = useNavigate()

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault()
    const { key, secret } = e.target as any

    await model.updateKrakenApiKey({ key: key.value, secret: secret.value })

    navigate('/balance', { replace: true })
  }

  const handleRemove = async () => {
    await model.updateKrakenApiKey({ key: '', secret: '' })
    window.location.reload()
  }

  return (
    <>
      <Show when={state.hasApiKey}>
        <Card
          outterClass="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
          innerClass="w-full max-w-md sm:space-y-8 sm:p-4"
        >
          API Key already set
          <button
            class="group relative flex w-full justify-center rounded-md border border-transparent bg-red-600 py-2 px-4 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            type="button"
            onClick={handleRemove}
          >
            Remove key
          </button>
        </Card>
      </Show>
      <Show when={!state.hasApiKey}>
        <Card
          outterClass="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
          innerClass="w-full max-w-md sm:space-y-8 sm:p-8"
        >
          <div>Kraken API key</div>
          <form class="space-y-6" onSubmit={handleSubmit}>
            <input type="hidden" name="remember" value="true" />
            <div class="-space-y-px rounded-md shadow-sm">
              <div>
                <label for="key" class="sr-only">
                  Key
                </label>
                <input
                  id="key"
                  required
                  autocomplete="off"
                  class="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  placeholder="Key"
                />
              </div>
              <div>
                <label for="secret" class="sr-only">
                  Secret
                </label>
                <input
                  id="secret"
                  required
                  autocomplete="off"
                  class="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  placeholder="Secret"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                class="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Add key
              </button>
            </div>
          </form>
        </Card>
      </Show>
    </>
  )
}
