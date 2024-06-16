<script lang="ts">
    import { onMount } from 'svelte'
    import { writable } from 'svelte/store'

    import Nav from './components/Nav.svelte'
    import Modal from './components/Modal.svelte'
    import DefaultView from "./views/Default.svelte"
    import SettingsView from './views/Settings.svelte'
    import Celebrate from './components/Celebrate.svelte'

    import SettingsStore from './stores/settings'
    import { initToday, getToday } from './stores/today'
    import { initModal, getModal, openModal } from './stores/modal'

    let PORT = chrome.runtime.connect({ name: 'popup' })
    
    initModal()
    initToday(PORT)

    const modal = getModal()
    const todayStore = getToday()

    const settings = new SettingsStore(PORT, todayStore)

    type PageView = 'default' | 'settings'
    let pageView = writable<PageView>('default')

    function setView(event: CustomEvent) {
        const { newView } = event.detail
        pageView.set(newView) 
        newView == 'default' ? todayStore.populate() : settings.populate()
    }

    onMount(() => {
        $pageView == 'default' ? todayStore.populate() : settings.populate()
        return() => {
            PORT.onDisconnect.addListener(() => (PORT = null))
        }
    })

    $: party = todayStore.canParty
    $: {
        if ($party) {
            openModal('complete')
        }
    }
</script>

<main class="relative -z-100 bg-cyan-500 flex flex-col bg-transparent p-4 pt-0 w-[280px] h-[360px]">
    <Nav view={$pageView} on:view={setView} />
    <Modal />

    <Celebrate party={$party} />

    <div 
        class="{$modal.visible ? 'shadow-black blur-md opacity-75' : ''}"
    >
        {#if $pageView == 'default'}
            <DefaultView />
        {:else}
            <SettingsView store={settings} />
        {/if}
    </div>
</main>
