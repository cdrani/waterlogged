<script lang="ts">
    import { writable } from 'svelte/store'
    import { db, populateDB } from 'common/data/db'

    import PopUp from '../../PopUp.svelte'
    import FormActions from '../FormActions.svelte'

    export let fullWidth: boolean = false

    let showModal = writable(false)

    const logOut = async () => {
        await db.cloud.logout({ force: true })
        await populateDB(db)
    }

    const onOpen = () => showModal.set(true)
    const onClose = () => showModal.set(false)
</script>

<button 
    name="Log Out"
    on:click|preventDefault={onOpen}
    on:touchend|preventDefault={onClose}
    class="inline-flex justify-center self-center items-center {fullWidth ? 'w-full h-12' : 'w-28 h-8'} bg-cyan-800 rounded-md"
>
    <span class="font-bold {fullWidth ? 'text-md' : 'text-sm'} text-white w-full">Log Out</span>
</button>

{#if $showModal} 
    <PopUp onClose={onClose}>
        <form on:submit|preventDefault={logOut} class="absolute flex flex-col w-full h-full gap-4 md:gap-6 p-4 pt-4 md:p-10">
            <h1 class="text-center text-black capitalize text-xl lg:text-2xl font-bold">
                Confirm log out
            </h1>

            <p class="text-md md:text-lg">This action will erase all of your local data. Unless your data is synced with cloud,
                {' '} <b class="underline">you will lose any changes you have made.</b>
            </p>

            <div class="fixed bottom-8 right-6 w-full flex justify-end">
                <FormActions onClose={onClose} submitLabel="Confirm" />
            </div>
        </form>
    </PopUp>
{/if}
