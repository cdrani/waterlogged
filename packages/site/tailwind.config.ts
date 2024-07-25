// import type { Config } from 'tailwindcss'

// export default {
// 	content: ['./src/**/*.{html,js,svelte,ts}'],

// 	theme: {
// 		extend: {}
// 	},

// } as Config

import type { Config } from 'tailwindcss'
import sharedConfig from 'common/tailwind.config'

const config: Pick<Config, 'content' | 'presets' | 'plugins'> = {
    content: ['./src/**/*.svelte', '../common/**/*.svelte'],
    presets: [sharedConfig],
	plugins: [require('@tailwindcss/typography')]
}

export default config
