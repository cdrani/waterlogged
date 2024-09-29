<script lang="ts">
    import { onMount } from 'svelte'
    import { page } from '$app/stores'
    import { writable } from 'svelte/store'

    import { db } from 'common/data/db'
    import LogsView from './LogsView.svelte'
    import Spinner from 'common/components/Spinner.svelte'

    db.open()

    let loading = writable<boolean>(false)
    const syncState = db.cloud.syncState

    const sync = async () => {
		if ($syncState?.status === 'connected') {
			try { await db.cloud.sync() }
			catch (error) { console.log(error) }
		    finally { loading.set(false) }
		} 

        if ($syncState?.status === 'offline') loading.set(false)
	}

    const resync = async () => {
        if (params.get('payments')) {
            // @ts-ignore
            await db.$logins.toCollection().modify({ accessTokenExpiration: new Date() })
        }
    }

	$: $syncState?.status, sync()
    $: params = $page.url.searchParams

	onMount(() => {
        sync(); resync()
    })
</script>

<svelte:head>
    <title>Water | Logs</title>
    <meta name="description" content="WaterLogged | Logs" />
</svelte:head>

{#if $loading}
    <Spinner />
{:else}
    <LogsView />
{/if}
