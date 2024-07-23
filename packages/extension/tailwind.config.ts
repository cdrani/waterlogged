import type { Config } from 'tailwindcss'
import sharedConfig from 'common/tailwind.config'

const config: Pick<Config, 'content' | 'presets'> = {
    content: ['../common/**/*.svelte'],
    presets: [sharedConfig]
}

export default config
