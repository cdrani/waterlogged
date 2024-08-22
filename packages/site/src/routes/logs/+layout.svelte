<script lang="ts">
    import { onMount } from 'svelte'
    import { pwaInfo } from 'virtual:pwa-info'
    import { browser } from '$app/environment'
	import { LogsService } from 'common/data/services'
    import { getNotificationOptions, onMessage } from '$lib/firebase/messaging'

    onMount(async () => {
        if (pwaInfo) {
            const { registerSW } = await import('virtual:pwa-register')
            registerSW({
                immediate: true,
                onRegistered(r: ServiceWorkerRegistration) {
                    // uncomment following code if you want check for updates
                    // r && setInterval(() => {
                    //    console.log('Checking for sw update')
                    //    r.update()
                    // }, 20000 /* 20s for testing purposes */)
                    // console.log(`SW Registered: ${r}`)
                },
                onRegisterError(error) {
                    console.log('SW registration error', error)
                },
            })
        }

        if (browser) {
            onMessage(payload => {
                const { data } = payload
                if (!data) return

                const notificationOptions = getNotificationOptions(data)
                const notification = new Notification(data.title, notificationOptions)

                notification.onclick = async (event) => {
                    event.preventDefault()
                    await LogsService.addLogIntake()
                    notification.close()
                }
            })
        }
    })

    $: webManifest = pwaInfo ? pwaInfo?.webManifest.linkTag : ''
</script>

<svelte:head>
    {@html webManifest}
</svelte:head>

<main class="relative flex justify-center gap-8 bg-transparent max-w-[90rem] mx-auto px-4 xs:px-0 sm:px-6 md:px-8 lg:px-0 h-full lg:max-h-[calc(100vh-48px)] overflow-hidden">
    <slot></slot>
</main>

{#await import('$lib/ReloadPrompt.svelte') then { default: ReloadPrompt }}
    <ReloadPrompt />
{/await}
