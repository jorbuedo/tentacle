import { resolve } from 'node:path'
import { URL, fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

export default defineConfig({
  resolve: {
    alias: {
      '~/': fileURLToPath(new URL('frontend/', import.meta.url)),
      '~b/': fileURLToPath(new URL('backend/', import.meta.url)),
      '~s/': fileURLToPath(new URL('scripts/', import.meta.url)),
    },
  },
  envPrefix: ['VITE_', 'TAURI_'],
  build: {
    target: 'esnext',
    rollupOptions: {
      input: {
        frontend: resolve(__dirname, './index.html'),
        backend: resolve(__dirname, 'backend/index.ts'),
      },
    },
  },
})
