import { defineConfig } from 'vite'
import { createVuePlugin as vue } from 'vite-plugin-vue2'
import ViteRequireContext from '@originjs/vite-plugin-require-context'
const path = require('path')

export default defineConfig({
  plugins: [vue(), ViteRequireContext()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
