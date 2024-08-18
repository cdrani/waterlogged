// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

import 'vite-plugin-pwa/svelte'
import 'vite-plugin-pwa/info'

declare global {
    declare const __DATE__: string
    declare const __RELOAD_SW__: boolean
	namespace App {
		// interface Error {}
       
		interface Locals {
            userid: string;
            buildDate: string;
            periodicUpdates: boolean;
        }

		// interface PageData {}
        
		// interface PageState {}
        
		// interface Platform {}
	}
}

export {}
