<script lang="ts">
    import { onMount } from 'svelte'
    import { liveQuery } from 'dexie'
    import { writable } from 'svelte/store'
    import { invoke } from '@tauri-apps/api/core'
    import { listen } from '@tauri-apps/api/event'
    import { isPermissionGranted, requestPermission } from '@tauri-apps/plugin-notification'

    import Nav from 'common/components/Nav.svelte'
    import GraphView from 'common/views/Graph.svelte'
    import Modal from 'common/components/Modal.svelte'
    import DefaultView from 'common/views/Default.svelte'
    import AccountView from './account/AccountView.svelte'
	import LoginUI from 'common/components/LoginUI.svelte'
    import SettingsView from 'common/views/Settings.svelte'
    import Celebrate from 'common/components/Celebrate.svelte'

    import { playAlarm } from 'common/utils/alarm'
    import type { ALERT, SETTINGS } from 'common/types'
    import AppNotification from '../utils/notification'
    import { initModal, openModal } from 'common/stores/modal'
	import { UserService, LogsService } from 'common/data/services'
    import { type Messaging, initMessageHandler  } from 'common/messaging'
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
    let notifier: AppNotification

    // ensure a log exists for every day
    const loadOnMount = async () => {
        await LogsService.load()
        messaging = initMessageHandler()
        notifier = new AppNotification()
    }

    async function messageCB(action: { key: string, value: string | boolean | number }) {
        await invoke('update_config', { action })
    }

    async function unMountCB(settings: Partial<SETTINGS>) {
        await invoke('update_settings', { settings })
    }

    async function requestNotificationPermission() {
        let permissionGranted = await isPermissionGranted();

        // If not we need to request it
        if (!permissionGranted) {
          const permission = await requestPermission()
          permissionGranted = permission === 'granted'
        }

        return permissionGranted
    }

    async function sendNotification() {
        const permissionGranted = await requestNotificationPermission()

        // TODO: instead show notification/modal to grant permission?
        if (!permissionGranted) return

        await notifier.notify()
    }

    type Payload = { sound: string, alert_type: ALERT }

    onMount(() => {
        (async () => {
            loadOnMount()

            const unlisten = await listen<Payload>('send_alert', async (event) => {
                const { alert_type, sound } = event.payload
                if (['alarm', 'both'].includes(alert_type)) await playAlarm(sound)
                if (['notify', 'both'].includes(alert_type)) await sendNotification()
            })

            return () => unlisten()
        })()
    })

	const user = liveQuery(async () => await UserService.getUser())
    let log = liveQuery(async () => await LogsService.getByDate())
    let party: boolean = false

    $: if ($log) {
        party = partyStore.canParty($log.complete)
        if (party) openModal('complete')
    }
</script>

{#if $log && $user}
    <section class="relative w-full h-full pb-6 overflow-y-hidden lg:max-w-[320px] flex flex-col rounded-md lg:mt-[4rem] lg:pb-[18rem]">
        <Nav view={$pageView} on:view={setView} />

        <LoginUI />
        <!-- <Celebrate party={party} /> -->

        <div class="flex flex-col w-full lg:h-full">
            {#if $pageView == 'default'}
                <DefaultView />
            {:else if $pageView == 'settings'}
                <SettingsView {messaging} {messageCB}  {unMountCB} />
            {:else if $pageView == 'graph'}
                <GraphView log={$log} />
            {:else}
                <AccountView />
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
