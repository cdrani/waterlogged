<script lang="ts">
    import { db } from 'common/data/db'
    import LogOut from './LogOut.svelte'

    const user = db.cloud.currentUser

    const openLogin = async () => db.cloud.login()
</script>

{#if !$user.isLoggedIn}
    <button 
        on:click={openLogin}
        on:touchend={openLogin}
        class="inline-flex justify-center self-center items-center w-20 h-8 bg-cyan-800 rounded-md"
    >
        <span class="font-bold text-sm text-white w-full">Log In</span>
    </button>
{:else}
    <LogOut />
{/if}
