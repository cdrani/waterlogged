<script lang="ts">
    import { onMount } from 'svelte'
    import { liveQuery } from 'dexie'
    import { writable } from 'svelte/store'

    import Nav from 'common/components/Nav.svelte'
    import Modal from 'common/components/Modal.svelte'
    import DefaultView from 'common/views/Default.svelte'
    import SettingsView from 'common/views/Settings.svelte'
    import Celebrate from 'common/components/Celebrate.svelte'

    import { ExtMessaging } from 'common/messaging'
    import { LogsService } from 'common/data/services'
    import { initModal, getModal, openModal } from 'common/stores/modal'
    import { initParty, getParty, type PartyStore } from 'common/stores/party'

    const PORT = chrome.runtime.connect({ name: 'popup' })
    
    initModal()
    initParty()

    const modal = getModal()
    const partyStore = getParty() as PartyStore

    type PageView = 'default' | 'settings'
    let pageView = writable<PageView>('default')

    function setView(event: CustomEvent) {
        const { newView } = event.detail
        pageView.set(newView) 
    }

    // ensure a log exists for every day
    async function loadOnMount() {
        await LogsService.load()
    }

    onMount(() => {
        loadOnMount()
        new ExtMessaging(PORT)
        return () => PORT.disconnect()
    })

    let log = liveQuery(async () => await LogsService.getByDate())
    let party: boolean = false

    $: if ($log) {
        party = partyStore.canParty($log)
        if (party) {
            openModal('complete')
        }
    }
</script>

<main class="relative -z-100 bg-cyan-200 flex flex-col pt-0 w-[280px] mx-auto h-full">
    <Nav view={$pageView} on:view={setView} />
    <Modal />

    <Celebrate party={party} />

    <div class="flex w-full h-full {$modal.visible ? 'shadow-black shadow-xl blur-xl opacity-75' : ''}">
        {#if $pageView == 'default'}
            <DefaultView />
        {:else}
            <SettingsView />
        {/if}
    </div>
</main>
