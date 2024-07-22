<script lang="ts">
    import { onMount } from 'svelte'
    import { writable } from 'svelte/store'

    import Nav from './components/Nav.svelte'
    import Modal from './components/Modal.svelte'
    import DefaultView from "./views/Default.svelte"
    import SettingsView from './views/Settings.svelte'
    import Celebrate from './components/Celebrate.svelte'

    import type TodayStore from './stores/today'
    import { initToday, getToday } from './stores/today'
    import type SettingsStore from './stores/settings'
    import { initSettings, getSettings } from './stores/settings'
    import { initModal, getModal, openModal } from 'common/stores/modal'

    let PORT = chrome.runtime.connect({ name: 'popup' })
    
    initModal()
    initToday(PORT)
    initSettings(PORT)

    const modal = getModal()
    const todayStore = getToday() as TodayStore
    const settingsStore = getSettings() as SettingsStore

    type PageView = 'default' | 'settings'
    let pageView = writable<PageView>('default')

    function setView(event: CustomEvent) {
        const { newView } = event.detail
        pageView.set(newView) 
        newView == 'default' ? todayStore.populate() : settingsStore.populate()
    }

    onMount(() => {
        $pageView == 'default' ? todayStore.populate() : settingsStore.populate()
        return () => PORT.disconnect()
    })

    $: party = todayStore.canParty
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
