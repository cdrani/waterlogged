<script lang="ts">
    import { onMount } from 'svelte'
    import { writable } from 'svelte/store'

    import Nav from './components/Nav.svelte'
    import Modal from './components/Modal.svelte'
    import DefaultView from "./views/Default.svelte"
    import SettingsView from './views/Settings.svelte'

    import { initModal, getModal, closeModal } from './stores/modal'
    import TodayStore from './stores/today'
    import SettingsStore from './stores/settings'

    let PORT = chrome.runtime.connect({ name: 'popup' })
    
    initModal()

    const modal = getModal()
    const today = new TodayStore(PORT)
    const settings = new SettingsStore(PORT, today)

    type PageView = 'default' | 'settings'
    let pageView = writable<PageView>('default')

    function setView(event: CustomEvent) {
        const { newView } = event.detail
        pageView.set(newView) 
        newView == 'default' ? today.populate() : settings.populate()
    }

    function saveCustomLog(e: SubmitEvent) {
        const formData = new FormData(e.target as HTMLFormElement)
        const [time, amount] = [...formData.values()]
        const log = { time, amount }
        
        today.logCustomIntake(log)
        closeModal()
    }

    onMount(() => {
        $pageView == 'default' ? today.populate() : settings.populate()
        return() => {
            PORT.onDisconnect.addListener(() => (PORT = null))
        }
    })
</script>

<main class="relative -z-100 bg-cyan-500 flex flex-col bg-transparent p-4 pt-0 w-[280px] h-[360px]">
    <Nav view={$pageView} on:view={setView} />
    <Modal actionHandler={(e) => saveCustomLog(e)} />

    <div 
        class="{$modal.visible ? 'shadow-black blur-md opacity-75' : ''}"
    >
        {#if $pageView == 'default'}
            <DefaultView store={today} />
        {:else}
            <SettingsView store={settings} />
        {/if}
    </div>
</main>
