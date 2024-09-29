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
    import { initModal } from 'common/stores/modal'
    import { initParty } from 'common/stores/party'
    import type { ALERT, SETTINGS } from 'common/types'
    import AppNotification from '../utils/notification'
	import { UserService, LogsService } from 'common/data/services'
    import { type Messaging, initMessageHandler  } from 'common/messaging'

    initModal()
    initParty()

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
</script>

{#if $log && $user}
    <main id="main" class="absolute mx-auto w-[280px] h-full flex flex-col rounded-md">
        <div class="static w-full">
            <Nav view={$pageView} on:view={setView} />
        </div>

        <Modal />
        <Celebrate />

        <LoginUI />

        <div class="relative flex flex-col w-full overflow-y-auto">
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
    </main>
{/if}
