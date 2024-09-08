<script lang="ts">
    import { db } from 'common/data/db'
    import { writable } from 'svelte/store'
    import Auth from '../Auth.svelte'

    export let userId: string
    let syncing = writable<boolean>(false)

    async function sync() {
        syncing.set(true)
        try {
            // @ts-ignore
            await db.$logins.toCollection().modify({ accessTokenExpiration: new Date() })
            await db.cloud.sync()
        } catch (error) {
            alert('Sync error. If you are out of eval days, upgrade to continue syncing.')
        } finally {
            syncing.set(false)
        }
    }
</script>

<div class="relative flex flex-col w-full h-screen mx-auto items-center py-4">
    <div class="relative flex w-full justify-between items-center bg-cyan-400 p-4 rounded-md">
        <h2>Sync Your Data</h2>
        <button 
            disabled={$syncing}
            on:click|preventDefault={sync}
            on:touchend|preventDefault={sync}
            class="inline-flex justify-center self-center items-center w-20 h-8 bg-cyan-800 rounded-md"
        >
            <span class="font-bold text-sm text-white w-full">{$syncing ? 'Sync...' : 'Sync'}</span>
        </button>
    </div>

    <div class="flex flex-col w-full">
        <hr class="w-full h-1 bg-cyan-600 my-8" />
        <Auth />
        <p class="fixed bottom-8 text-md text-center">Logged in as: <b>{userId}<b><p>
    </div>
</div>
