<script lang="ts">
    import { db } from 'common/data/db'
    const userId = db.cloud.currentUserId

    function openLogin() {
        db.cloud.login()
    }

    async function logOut() {
        await db.cloud.logout()

    }
</script>

{#if userId == 'unauthorized'}
    <button 
        on:click={openLogin}
        on:touchend={openLogin}
        class="inline-flex justify-center self-center items-center w-20 h-8 bg-cyan-800 rounded-md"
    >
        <span class="font-bold text-sm text-white w-full">Log In</span>
    </button>
{:else}
    <button 
        on:click={logOut}
        on:touchend={logOut}
        class="inline-flex justify-center self-center items-center w-24 h-8 bg-cyan-800 rounded-md"
    >
        <span class="font-bold text-sm text-white w-full">Log Out</span>
    </button>
{/if}
