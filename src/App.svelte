<script lang="ts">
    import { onMount } from 'svelte'
    import { writable } from 'svelte/store'

    import DefaultView from "./views/Default.svelte"

    let PORT = chrome.runtime.connect({ name: 'popup' })
    
    let view = writable<'default'>('default')

    onMount(async () => {
        return() => {
            PORT.onDisconnect.addListener(() => (PORT = null))
        }
    })
</script>

<main class="relative -z-100 bg-cyan-500 flex flex-col bg-transparent p-4 pb-0 w-[280px] h-[360px]">
    {#if $view == 'default' && PORT}
        <DefaultView port={PORT} />
    {/if}
</main>
