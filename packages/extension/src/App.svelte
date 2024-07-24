<script lang="ts">
    import { onMount } from 'svelte'
    import { writable } from 'svelte/store'

    import Nav from 'common/components/Nav.svelte'
    import Modal from 'common/components/Modal.svelte'
    import DefaultView from 'common/views/Default.svelte'
    import SettingsView from 'common/views/Settings.svelte'
    import Celebrate from 'common/components/Celebrate.svelte'

    import { type LogStore, initLog, getLog } from 'common/stores/log'
    import { initModal, getModal, openModal } from 'common/stores/modal'
    import { type SettingsStore, initSettings, getSettings } from 'common/stores/settings'

    const PORT = chrome.runtime.connect({ name: 'popup' })
    
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

    <div class="flex w-full h-full {$modal.visible ? 'shadow-black shadow-xl blur-xl opacity-75' : ''}">
        {#if $pageView == 'default'}
            <DefaultView />
        {:else}
            <SettingsView />
        {/if}
    </div>
</main>
