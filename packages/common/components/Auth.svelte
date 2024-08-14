<script lang="ts">
    import { db, populateDB } from 'common/data/db'

    const user = db.cloud.currentUser

    const openLogin = async () => db.cloud.login()

    const logOut = async () => {
        await db.cloud.logout({ force: true })
        await populateDB(db)
    }
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
    <button 
        on:click={logOut}
        on:touchend={logOut}
        class="inline-flex justify-center self-center items-center w-24 h-8 bg-cyan-800 rounded-md"
    >
        <span class="font-bold text-sm text-white w-full">Log Out</span>
    </button>
{/if}
