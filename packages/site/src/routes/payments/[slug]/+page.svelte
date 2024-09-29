<script lang="ts">
    import { db } from 'common/data/db'
    import { page } from '$app/stores'
	import { goto } from '$app/navigation'
    import type { PageData } from './$types'
	import { onMount, onDestroy } from 'svelte'

    export let data: PageData
    let countdown = 10
    let message = ''
    let interval: Timer

    $: params = $page.url.searchParams

    const resync = async () => {
        const ref = params.get('ref')
        if (ref == 'crx') {
            message = 'You may safely close this page and continue with the extension.'
        } else if (ref == 'web') {
                message = 'Redirecting back to the Logs page in 10 seconds.'
            startCountdown(() => {
                startCountdown(() => goto(`/logs?payments=${data!.status}`))
            })
        }
    }

    const updateMessage = () => {
        const ref = params.get('ref')
        if (ref === 'web') message = `Redirecting back to Logs page in ${countdown} seconds.`
    }

    const startCountdown = (callback: () => void) => {
        interval = setInterval(() => {
            countdown--
            if (countdown > 0) updateMessage()
            else { 
                clearInterval(interval)
                callback()
            }
        }, 1000)
    }

    onMount(resync)
    onDestroy(() => {
        if (interval) clearInterval(interval)
    })
</script>

<main class="flex flex-col relative gap-10 w-full h-screen max-w-screen-md mx-auto p-5 md:p-8 xl:p-16">
    {#if params.get('ref')}
        <h2 class="p-4 xs:p-6 md:p-10 max-w-screen-md bg-cyan-600 rounded-md text-white text-lg md:text-2xl lg:text-3xl">{message.replace('5', `${countdown}`)}</h2>
    {/if}
    <div class="flex flex-col justify-center items-center gap-4 md:gap-8 lg:gap-10 bg-cyan-800 border-md border-white rounded-md p-6 md:p-10">
        <h1 class="text-white text-center font-bold text-2xl xs:text-3xl md:text-4xl lg:text-6xl">{data.title}</h1>
        {#if data?.content}
            <section class="p-6 md:p-10 bg-white rounded-md border-4 border-cyan-200">
                <p class="text-base xs:text-lg md:text-2xl lg:text-3xl">{data.content}</p>
            </section>
        {/if}
    </div>
</main>
