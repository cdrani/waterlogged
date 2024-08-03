<script lang="ts">
    import { onMount } from 'svelte'
    import { liveQuery } from 'dexie'
    import { writable } from 'svelte/store'

    import Nav from 'common/components/Nav.svelte'
    import Modal from 'common/components/Modal.svelte'
    import DefaultView from 'common/views/Default.svelte'
    import SettingsView from 'common/views/Settings.svelte'
    import Celebrate from 'common/components/Celebrate.svelte'

    import { db } from 'common/data/db'
	import { LogsService } from 'common/data/services'
	import { initMessageHandler } from 'common/messaging'
    import { notificationManager } from '$lib/notification'
    import { initModal, getModal, openModal } from 'common/stores/modal'
    import { type PartyStore, initParty, getParty } from 'common/stores/party'

    db.open()

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
        initMessageHandler()
        notificationManager.startTimer()
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

<svelte:head>
    <title>Water | Logs</title>
    <meta name="description" content="WaterLogged | Logs" />
</svelte:head>

<div class="relative -z-100 bg-cyan-200 flex flex-col pt-0 w-[280px] mx-auto h-full">
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
</div>
