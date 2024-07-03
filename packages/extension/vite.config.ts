import { defineConfig } from 'vite'
import { crx } from '@crxjs/vite-plugin'
import { svelte } from '@sveltejs/vite-plugin-svelte'

import manifest from './manifest.json'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [svelte(), crx({ manifest })],
    build: {
        rollupOptions: {
            input: {
                offscreen: 'src/offscreen.html'
            }
        }
    }
})
