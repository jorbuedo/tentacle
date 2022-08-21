import fs from 'fs'

/**
 * This script is used to rename the binaries created by pkg for each main
 * platform
 */
async function main() {
  const fileNames = [
    ['linux', 'x86_64-unknown-linux-gnu'],
    ['macos', 'x86_64-apple-darwin'],
    ['win.exe', 'x86_64-pc-windows-msvc.exe'],
  ]
  fileNames.forEach((names) => {
    fs.renameSync(
      `src-tauri/node-bin/backend-${names[0]}`,
      `src-tauri/node-bin/backend-${names[1]}`
    )
  })
}

main().catch((e) => {
  throw e
})
