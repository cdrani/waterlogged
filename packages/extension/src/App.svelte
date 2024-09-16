<script lang="ts">
    import { onMount } from 'svelte'
    import { writable } from 'svelte/store'

    import { db } from 'common/data/db'
    import LogsView from './components/LogsView.svelte'
    import Spinner from 'common/components/Spinner.svelte'

    db.open()

    let loading = writable<boolean>(false)
    const syncState = db.cloud.syncState

    const sync = async () => {
		if ($syncState?.status === 'connected') {
			try { await db.cloud.sync({ purpose: 'pull', wait: true }) }
			catch (error) { console.log(error) }
		    finally { loading.set(false) }
		} 

        if ($syncState?.status === 'offline') loading.set(false)
	}

	$: $syncState?.status, sync()

	onMount(sync)
</script>

{#if $loading}
    <Spinner />
{:else}
    <LogsView />
{/if}
