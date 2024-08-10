<script lang="ts">
    import { onMount } from 'svelte'
    import { liveQuery } from 'dexie'
    import { writable } from 'svelte/store'

    import Nav from 'common/components/Nav.svelte'
    import GraphView from 'common/views/Graph.svelte'
    import Modal from 'common/components/Modal.svelte'
    import DefaultView from 'common/views/Default.svelte'
    import SettingsView from 'common/views/Settings.svelte'
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
    let pageView = writable<PageView>('default')

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

<section class="relative z-[10] lg:fixed lg:left-[max(0%, calc(50%-45rem))] w-full lg:max-w-[320px] flex flex-col pt-0 pb-24 rounded-md bg-cyan-200">
    <Nav app="web" view={$pageView} on:view={setView} />
    <Modal />

    <Celebrate party={party} />

    <div class="relative flex w-full {$modal.visible ? 'shadow-black shadow-xl blur-xl opacity-75' : ''}">
        {#if $pageView == 'default'}
            <DefaultView />
        {:else if $pageView == 'settings'}
            <SettingsView messaging={messaging} />
        {:else}
            <GraphView log={$log} />
        {/if}
    </div>
</section>

<section class="hidden top-0 w-full lg:flex md:relative md:pl-[350px] max-w-4xl lg:max-w-none">
    <GraphView log={$log} />
</section>

<div 
    id="tooltip"
    class="items-center justify-center fixed z-[2000] hidden h-5 w-full max-w-[120px] rounded-[4px] top-4 border-gray-400 bg-white border-sm py-0.5 px-1 text-[12px]"
>
    <span></span>
</div>
