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

    import { ExtMessaging } from 'common/messaging'
    import { initModal, openModal } from 'common/stores/modal'
    import { LogsService, UserService } from 'common/data/services'
    import { initParty, getParty, type PartyStore } from 'common/stores/party'

    const PORT = chrome.runtime.connect({ name: 'popup' })
    
    initModal()
    initParty()

    const partyStore = getParty() as PartyStore

    type PageView = 'default' | 'settings' | 'graph'
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
        return () => PORT.disconnect()
    })

	const user = liveQuery(async () => await UserService.getUser())
    const log = liveQuery(async () => await LogsService.getByDate())

    let party: boolean = false

    $: if ($log) {
        party = partyStore.canParty($log.complete)
        if (party) {
            openModal('complete')
        }
    }

    const messaging = new ExtMessaging(PORT)
</script>

{#if $log && $user}
    <main class="relative -z-100 bg-cyan-200 flex flex-col pt-0 w-[280px] mx-auto h-full">
        <Nav view={$pageView} on:view={setView} />
        <Modal />

        <LoginUI />

        <Celebrate party={party} />

        <div class="flex w-full h-full">
            {#if $pageView == 'default'}
                <DefaultView />
            {:else if $pageView == 'settings'}
                <SettingsView messaging={messaging} />
            {:else}
                <GraphView log={$log} />
            {/if}
        </div>
    </main>
{/if}
