<script lang="ts">
    import { db } from 'common/data/db'
    import LogOutForm from './forms/auth/LogOutForm.svelte'

    const user = db.cloud.currentUser

    const openLogin = async () => db.cloud.login()
    export let fullWidth: boolean = false
</script>

{#if !$user.isLoggedIn}
    <button 
        on:click|preventDefault={openLogin}
        on:touchend|preventDefault={openLogin}
        class="inline-flex justify-center self-center items-center {fullWidth ? 'w-full h-12' : 'w-20 h-10'} bg-cyan-800 rounded-md"
    >
        <span class="font-bold text-sm text-white w-full">Log In</span>
    </button>
{:else}
    <LogOutForm {fullWidth} />
{/if}
