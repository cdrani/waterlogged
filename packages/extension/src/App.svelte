<script lang="ts">
    import { onMount } from 'svelte'
    import { writable } from 'svelte/store'

    import Nav from './components/Nav.svelte'
    import Modal from './components/Modal.svelte'
    import DefaultView from "./views/Default.svelte"
    import SettingsView from './views/Settings.svelte'
    import Celebrate from './components/Celebrate.svelte'

    import type LogStore from 'common/stores/log'
    import { initLog, getLog } from './stores/log'
    import type SettingsStore from 'common/stores/settings'
    import { initSettings, getSettings } from './stores/settings'
    import { initModal, getModal, openModal } from 'common/stores/modal'

    let PORT = chrome.runtime.connect({ name: 'popup' })
    
    initModal()
    initLog(PORT)
    initSettings(PORT)

    const modal = getModal()
    const logStore = getLog() as LogStore
    const settingsStore = getSettings() as SettingsStore

    type PageView = 'default' | 'settings'
    let pageView = writable<PageView>('default')

    function setView(event: CustomEvent) {
        const { newView } = event.detail
        pageView.set(newView) 

        loadView(newView)
    }

    function loadView(view: PageView) {
        view == 'default' ? logStore.populate() : settingsStore.populate()
    }

    onMount(() => {
        loadView($pageView)
        return () => PORT.disconnect()
    })

    $: party = logStore.canParty
    $: {
        if ($party) {
            openModal('complete')
        }
    }
</script>

<main class="relative -z-100 bg-cyan-200 flex flex-col pt-0 w-[280px] mx-auto h-full">
    <Nav view={$pageView} on:view={setView} />
    <Modal />

    <Celebrate party={$party} />

    <div 
        class="{$modal.visible ? 'shadow-black blur-md opacity-75' : 'flex w-full h-full'}"
    >
        {#if $pageView == 'default'}
            <DefaultView />
        {:else}
            <SettingsView />
        {/if}
    </div>
</main>
