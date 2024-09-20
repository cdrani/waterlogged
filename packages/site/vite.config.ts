// import fs from 'node:fs'
// import os from 'node:os'

import { defineConfig } from 'vite'
import { sveltekit } from '@sveltejs/kit/vite'
import { SvelteKitPWA } from '@vite-pwa/sveltekit'
import { enhancedImages } from '@sveltejs/enhanced-img'

// const homeDir = os.homedir()

const mode = process.env.NODE_ENV as 'development' | 'production'

export default defineConfig({
    // server: {
    //     https: {
    //         cert: fs.readFileSync(`${homeDir}/localhost.pem`),
    //         key: fs.readFileSync(`${homeDir}/localhost-key.pem`),
    //     },
    //     host: '0.0.0.0',
    //     proxy: {},
    // },
    define: {
		__RELOAD_SW__: false,
		__DATE__: `'${new Date().toISOString()}'`,
		'process.env.NODE_ENV': process.env.NODE_ENV === 'production' ? '"production"' : '"development"',
	},
	plugins: [
        enhancedImages(),
        sveltekit(),
        SvelteKitPWA({
            srcDir: 'src',
            mode,
            strategies: 'injectManifest',
            filename: 'prompt-sw.ts',
            scope: '/',
            base: '/',
            selfDestroying: process.env.SELF_DESTROYING_SW == 'true',
            manifest: {
                scope: '/',
                start_url: '/',
                display: 'standalone',
                theme_color: '#ffffff',
                background_color: '#ffffff',
                short_name: 'Water Logged',
                name: 'WaterLogged: Tracker & Reminder',
                description: 'Track your progress to meet your hydration goals. Set custom reminders to stay hydrated.',
                icons: [
                    {
                        src: '/pwa/pwa-192x192.png',
                        sizes: '192x192',
                        type: 'image/png',
                    },
                    {
                        src: '/pwa/pwa-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                    },
                    {
                        src: '/pwa/pwa-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'any maskable',
                    },
                ],
            },
            injectManifest: {
                globPatterns: ['client/**/*.{js,css,ico,png,svg,webp,woff,woff2}']
            },
            workbox: {
                globPatterns: ['client/**/*.{js,css,ico,png,svg,webp,woff,woff2}']
            },
            devOptions: {
                enabled: mode == 'development',
                type: 'module',
                navigateFallback: '/',
                suppressWarnings: process.env.SUPPRESS_WARNING === 'true',
            },
            kit: {
                includeVersionFile: true,
            }
        })
    ]
})
