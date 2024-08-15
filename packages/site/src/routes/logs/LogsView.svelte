<script lang="ts">
    import { onMount } from 'svelte'
    import { liveQuery } from 'dexie'
    import { writable } from 'svelte/store'

    import Nav from 'common/components/Nav.svelte'
    import GraphView from 'common/views/Graph.svelte'
    import Modal from 'common/components/Modal.svelte'
    import DefaultView from 'common/views/Default.svelte'
	import LoginUI from 'common/components/LoginUI.svelte'
    import SettingsView from 'common/views/Settings.svelte'
    import Celebrate from 'common/components/Celebrate.svelte'

    import WebNotification from '$lib/notification'
    import { type Messaging } from 'common/messaging'
	import { initMessageHandler } from 'common/messaging'
    import { initModal, openModal } from 'common/stores/modal'
	import { UserService, LogsService } from 'common/data/services'
    import { type PartyStore, initParty, getParty } from 'common/stores/party'

    initModal()
    initParty()

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

	const user = liveQuery(async () => await UserService.getUser())
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

{#if $log && $user}
    <section class="relative w-full h-full pb-6 overflow-y-hidden lg:max-w-[320px] flex flex-col rounded-md lg:mt-[4rem] lg:pb-[18rem]">
        <Nav view={$pageView} on:view={setView} />

        <LoginUI />
        <Celebrate party={party} />

        <div class="flex flex-col w-full lg:h-full">
            {#if $pageView == 'default'}
                <DefaultView />
            {:else if $pageView == 'settings'}
                <SettingsView messaging={messaging} />
            {:else}
                <GraphView log={$log} />
            {/if}
        </div>
    </section>

    <Modal />

    <section class="hidden top-0 w-full lg:flex relative lg:h-screen xl:max-w-3xl 2xl:max-w-5xl lg:mt-[4rem] lg:pb-[11rem]">
        <GraphView log={$log} />
    </section>

    <div 
        id="tooltip"
        class="items-center justify-center fixed z-[2000] hidden h-5 w-full max-w-[120px] rounded-[4px] top-4 border-gray-400 bg-white border-sm py-0.5 px-1 text-[12px]"
    >
        <span></span>
    </div>
{/if}
