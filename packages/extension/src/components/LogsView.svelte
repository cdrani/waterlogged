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
    import Celebrate from 'common/components/Celebrate.svelte'

    import { ExtMessaging } from 'common/messaging'
    import { initModal } from 'common/stores/modal'
    import { initParty } from 'common/stores/party'
    import { LogsService, UserService } from 'common/data/services'

    const PORT = chrome.runtime.connect({ name: 'popup' })
    
    initModal()
    initParty()

    type PageView = 'default' | 'settings' | 'graph' | 'account'
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

    const messaging = new ExtMessaging(PORT)
</script>

{#if $log && $user}
    <main id="main" class="relative -z-100 bg-cyan-200 flex flex-col pt-0 w-[280px] mx-auto h-full" style="height: 400px">
        <div class="static w-full">
            <Nav view={$pageView} on:view={setView} />
        </div>

        <Modal />

        <LoginUI />

        <Celebrate />

        <div class="relative flex h-full overflow-y-auto sm:mt-4">
            {#if $pageView == 'default'}
                <DefaultView />
            {:else if $pageView == 'settings'}
                <SettingsView messaging={messaging} />
            {:else if $pageView == 'graph'}
                <GraphView log={$log} />
            {:else}
                <AccountView />
            {/if}
        </div>
    </main>
{/if}
