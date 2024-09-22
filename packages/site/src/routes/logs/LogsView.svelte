<script lang="ts">
    import { onMount } from 'svelte'
    import { liveQuery } from 'dexie'
    import { writable } from 'svelte/store'

    import Nav from 'common/components/Nav.svelte'
    import GraphView from 'common/views/Graph.svelte'
    import Modal from 'common/components/Modal.svelte'
    import DefaultView from 'common/views/Default.svelte'
    import AccountView from 'common/views/Account.svelte'
	import LoginUI from 'common/components/LoginUI.svelte'
    import SettingsView from 'common/views/Settings.svelte'
    // import Celebrate from 'common/components/Celebrate.svelte'

    import WebNotification from '$lib/notification'
    import { type Messaging } from 'common/messaging'
	import { initMessageHandler } from 'common/messaging'
    import { initModal, openModal } from 'common/stores/modal'
	import { UserService, LogsService } from 'common/data/services'
    import { getToken, isSupported } from '$lib/firebase/messaging'
    import { type PartyStore, initParty, getParty } from 'common/stores/party'

    initModal()
    initParty()

    const partyStore = getParty() as PartyStore

    type PageView = 'default' | 'settings' | 'graph' | 'account'
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

    async function requestNotificationPermission() {
        const permission = await Notification.requestPermission()
        if (!((await isSupported() || permission !== 'granted'))) {
            console.log('Notification either not supported or permission was denied.')
            return
        }

        try {
            if ($user?.token) return

            const token = await getToken(await navigator.serviceWorker.ready) 
            token && await UserService.setToken(token)
        } catch(e) {
            console.error('ERROR: ', e)
        }
    }

    onMount(() => {
        requestNotificationPermission()
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
    <section class="relative h-full overflow-y-hidden w-[320px] xs:w-full md:w-[320px] flex flex-col justify-center items-center lg:h-[80dvh]">
        <div class="static md:top-10 w-full">
            <Nav view={$pageView} on:view={setView} />
        </div>

        <LoginUI />
        <!-- <Celebrate party={party} /> -->

        {#if $pageView == 'default'}
            <DefaultView />
        {:else if $pageView == 'settings'}
            <SettingsView messaging={messaging} />
        {:else if $pageView == 'graph'}
            <GraphView log={$log} />
        {:else}
            <AccountView />
        {/if}
    </section>

    <Modal />

    <section class="hidden top-0 sm:flex sm:flex-1 w-full md:w-2/3 relative justify-center items-center md:my-[6rem] md:h-[80dvh]">
        <GraphView log={$log} />
    </section>
{/if}
