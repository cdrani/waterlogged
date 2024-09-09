<script lang="ts">
    import PopUp from './PopUp.svelte'
    import { writable } from 'svelte/store'

    export let evalDays: number = 30
    let showModal = writable<boolean>(false)
    const onOpen = () => showModal.set(true)
    const onClose = () => showModal.set(false)
</script>

<p 
    class="inline-flex items-center text-sm underline font-semibold cursor-pointer"
    on:click|preventDefault={onOpen}
    on:touchend|preventDefault={onOpen}
>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-4 h-4 mr-0.5">
        <path class="fill-black" d="M11 17h2v-6h-2zm1-8q.425 0 .713-.288T13 8t-.288-.712T12 7t-.712.288T11 8t.288.713T12 9m0 13q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22m0-2q3.35 0 5.675-2.325T20 12t-2.325-5.675T12 4T6.325 6.325T4 12t2.325 5.675T12 20m0-8" />
    </svg>

    Eval Days Left: {evalDays}
</p>

{#if $showModal}
    <PopUp onClose={onClose}>
        <div class="fixed flex flex-col w-full h-full gap-2 md:gap-6 p-4 md:p-10">
            <h4 class="font-bold leading-none text-xl text-center">
                What are eval days?
            </h4>
            <p>
                How long you can continue syncing your data for free.
                Once this period ends, your data will <b>only</b> be
                available on this device. You can upgrade to Premium to
                resume syncing between devices.
            </p>


            <button 
                on:click|preventDefault={onClose}
                on:touchend|preventDefault={onClose}
                class="w-16 h-8 md:w-20 md:h-9 bg-white rounded-md inline-flex self-end justify-center items-center"
            >
                <span class="text-center font-semibold text-[14px] md:text-[16px] text-black">Close</span>
            </button>
        </div>
    </PopUp>
{/if}
