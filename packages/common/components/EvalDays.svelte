<script lang="ts">
    import PopUp from './PopUp.svelte'
    import { writable } from 'svelte/store'

    export let evalDays: number = 30
    let showModal = writable<boolean>(false)
    const onOpen = () => showModal.set(true)
    const onClose = () => showModal.set(false)
</script>

<button 
    class="inline-flex items-center text-xs underline font-semibold cursor-pointer"
    on:click|preventDefault={onOpen}
    on:touchend|preventDefault={onOpen}
>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-4 h-4 mr-0.5">
        <path class="fill-black" d="M11 17h2v-6h-2zm1-8q.425 0 .713-.288T13 8t-.288-.712T12 7t-.712.288T11 8t.288.713T12 9m0 13q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22m0-2q3.35 0 5.675-2.325T20 12t-2.325-5.675T12 4T6.325 6.325T4 12t2.325 5.675T12 20m0-8" />
    </svg>

    Eval Days Left: {evalDays}
</button>

{#if $showModal}
    <PopUp onClose={onClose}>
        <div class="fixed flex flex-col w-full h-full gap-4 md:gap-6 p-4 md:p-10">
            <h2 class="font-bold text-white leading-none text-xl md:text-2xl lg:text-3xl text-center">
                What are Eval Days?
            </h2>

            <p class="text-base md:text-2xl">
                Period where <u>cloud</u> data syncing is <b>FREE</b>.
                After this period, your data will <b><i>only</i></b> be
                stored on this device. Upgrade to Pro to resume cross-device syncing.
            </p>

            <div class="fixed bottom-8 right-8 justify-end">
                <button 
                    on:click|preventDefault={onClose}
                    on:touchend|preventDefault={onClose}
                    class="w-20 h-9 bg-white rounded-md inline-flex self-end justify-center items-center"
                >
                    <span class="text-center font-semibold text-[14px] md:text-base text-black">Close</span>
                </button>
            </div>
        </div>
    </PopUp>
{/if}
