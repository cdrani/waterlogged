import type { Config } from 'tailwindcss'
const defaultTheme = require('tailwindcss/defaultTheme')


const config: Omit<Config, 'content'> = {
    theme: {
        extend: {
            screens: {
                xs: '320px',
                ...defaultTheme.screens
            },
        },
    },
    plugins: [],
}

export default config
