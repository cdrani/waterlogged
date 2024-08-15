<script lang="ts">
    import { writable } from 'svelte/store'
    import { db, populateDB } from 'common/data/db'

    import PopUp from './PopUp.svelte'
    import FormActions from './FormActions.svelte'

    let showModal = writable(false)

    const logOut = async () => {
        await db.cloud.logout({ force: true })
        await populateDB(db)
    }

    const onOpen = () => showModal.set(true)
    const onClose = () => showModal.set(false)
</script>


<button 
    on:click|preventDefault={onOpen}
    on:touchend|preventDefault={onOpen}
    class="inline-flex justify-center self-center items-center w-24 h-8 bg-cyan-800 rounded-md"
>
    <span class="font-bold text-sm text-white w-full">Log Out</span>
</button>

{#if $showModal} 
    <PopUp onClose={onClose}>
        <form on:submit|preventDefault={logOut} class="absolute flex flex-col w-full h-full gap-4 md:gap-6 p-4 pt-4 md:p-10">
            <h1 class="text-center text-white capitalize text-lg md:text-xl lg:text-2xl font-bold">
                Confirm log out
            </h1>

            <p class="text-[14px] md:text-lg">This action will erase all of your local data. Unless your data is synced with cloud,
                {' '} <b class="underline">you will lose any changes you have made.</b>
            </p>

            <FormActions onClose={onClose} />
        </form>
    </PopUp>
{/if}
