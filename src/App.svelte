<script lang="ts">
    import { onMount } from 'svelte'
    import { writable } from 'svelte/store'

    import DefaultView from "./views/Default.svelte"
    import SettingsView from './views/Settings.svelte'

    import TodayStore from './stores/today'
    import SettingsStore from './stores/settings'

    let PORT = chrome.runtime.connect({ name: 'popup' })
    
    const today = new TodayStore(PORT)
    const settings = new SettingsStore(PORT, today)

    type View = 'default' | 'settings'
    let view = writable<View>('default')

    function switchView() {
        view.update(prev => prev == 'default' ? 'settings' : 'default') 
        $view == 'default' ? today.populate() : settings.populate()
    }

    onMount(() => {
        $view == 'default' ? today.populate() : settings.populate()
        return() => {
            PORT.onDisconnect.addListener(() => (PORT = null))
        }
    })
</script>

<main class="relative -z-100 bg-cyan-500 flex flex-col bg-transparent p-4 w-[280px] h-[360px]">
    <button class="w-12 h-4 bg-green-500 text-xs" on:click={switchView}>Switch</button>

    {#if $view == 'default'}
        <DefaultView store={today} />
    {:else}
        <SettingsView store={settings} />
    {/if}
</main>
