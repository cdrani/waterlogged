<script lang="ts">
    import { onMount } from 'svelte'
    import { liveQuery } from 'dexie'
    import { writable } from 'svelte/store'

    import Nav from 'common/components/Nav.svelte'
    import GraphView from 'common/views/Graph.svelte'
    import Modal from 'common/components/Modal.svelte'
    import DefaultView from 'common/views/Default.svelte'
    import SettingsView from 'common/views/Settings.svelte'
    import Graph from 'common/components/graph/Graph.svelte'
    import Celebrate from 'common/components/Celebrate.svelte'

    import { db } from 'common/data/db'
    import WebNotification from '$lib/notification'
    import { type Messaging } from 'common/messaging'
	import { LogsService } from 'common/data/services'
	import { initMessageHandler } from 'common/messaging'
    import { initModal, getModal, openModal } from 'common/stores/modal'
    import { type PartyStore, initParty, getParty } from 'common/stores/party'

    db.open()

    initModal()
    initParty()

    const modal = getModal()
    const partyStore = getParty() as PartyStore

    type PageView = 'default' | 'settings' | 'graph'
    let pageView = writable<PageView>('graph')

    function setView(event: CustomEvent) {
        const { newView } = event.detail
        pageView.set(newView) 
    }

    let messaging: Messaging

    // ensure a log exists for every day
    async function loadOnMount(notificationManager: WebNotification) {
        await LogsService.load()
        await notificationManager.startTimer()
    }

    onMount(() => {
        const notificationManager = new WebNotification()
        messaging = initMessageHandler({ notificationManager })
        loadOnMount(notificationManager)
    })

    let log = liveQuery(async () => await LogsService.getByDate())
    let party: boolean = false

    $: if ($log) {
        party = partyStore.canParty($log.complete)
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
        {:else if $pageView == 'settings'}
            <SettingsView messaging={messaging} />
        {:else}
            <GraphView />
        {/if}
    </div>
</div>
