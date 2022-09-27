import { resolve } from 'node:path'
import { URL, fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'
import createExternal from 'vite-plugin-external'
import postcss from './postcss.config.js'

export default defineConfig({
  plugins: [
    createExternal({
      externals: {
        'sqlite3': 'sqlite3',
        'node:crypto': 'crypto',
        'node:path': 'path',
        'node:os': 'os',
        'node:fs': 'fs',
      },
    }),
    solidPlugin(),
  ],
  resolve: {
    alias: {
      '~/': fileURLToPath(new URL('frontend/', import.meta.url)),
      '~b/': fileURLToPath(new URL('backend/', import.meta.url)),
      '~s/': fileURLToPath(new URL('scripts/', import.meta.url)),
    },
  },
  // prevent vite from obscuring rust errors
  clearScreen: false,
  // Tauri expects a fixed port, fail if that port is not available
  server: {
    strictPort: true,
  },
  // to make use of `TAURI_PLATFORM`, `TAURI_ARCH`, `TAURI_FAMILY`,
  // `TAURI_PLATFORM_VERSION`, `TAURI_PLATFORM_TYPE` and `TAURI_DEBUG`
  // env variables
  envPrefix: ['VITE_', 'TAURI_'],
  build: {
    target: 'esnext',
    rollupOptions: {
      input: {
        frontend: resolve(__dirname, './index.html'),
        backend: resolve(__dirname, 'backend/index.ts'),
      },
      output: [
        {
          dir: 'dist',
        },
        {
          dir: 'dist',
          entryFileNames: '[name].js',
          format: 'cjs',
        },
      ],
    },
  },
  css: {
    postcss,
  },
})
