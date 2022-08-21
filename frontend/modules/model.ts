import { Command } from '@tauri-apps/api/shell'
import { initModel } from '~/view'

export const install = async () => {
  const command = Command.sidecar('node-bin/backend')
  command.on('close', (data) => {
    console.log(
      `Node backend finished with code ${data.code} and signal ${data.signal}`
    )
  })
  command.on('error', (error) =>
    console.error(`Node backend error: "${error}"`)
  )
  command.stderr.on('data', console.warn)

  const child = await command.spawn()

  window.model = initModel({ command, child })
}
