<script lang="ts">
    import CurrentTime from './CurrentTime.svelte'
    import AddLogForm from './forms/log/AddLogForm.svelte';

    type Tank = { measurement: string, goal: number, total: number }
    export let tank: Tank
    export let waterLevel: number = 0

    export let handleLog: () => void = () => {}
    export let handleModal: () => void = () => {}
</script>

<section class="overflow-hidden rounded-md relative bg-cyan-500 flex flex-col p-4 w-full h-full">
    <div class="flex relative z-20 w-full h-full justify-between">
        <CurrentTime />
        <div class="flex flex-col min-w-[100px] max-w-3/5 items-end">
            <p class="flex gap-x-2 justify-between font-semibold text-sm xs:text-lg text-black w-full">
                <span class="inline-flex text-left">Total:</span>
                <span class="inline-flex justify-end">{tank.total}{tank.measurement}</span>
            </p>
            <p class="flex gap-x-2 justify-between font-semibold text-sm xs:text-lg text-black w-full">
                <span class="inline-flex text-left">Goal:</span>
                <span class="inline-flex justify-end">{tank.goal}{tank.measurement}</span>
            </p>
        </div>
    </div>

    <div class="relative z-20 bottom-2 h-6 w-full">
        <div class="flex gap-3">
            <button
                class="w-8 h-8"
                aria-label="Default Log Amount"
                on:click|preventDefault={handleLog}
                on:touchend|preventDefault={handleLog}
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="#155e75"  viewBox="0 0 24 24">
                    <path d="M17 13h-4v4h-2v-4H7v-2h4V7h2v4h4m-5-9A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2" />
                </svg>
            </button>

            <button 
                class="w-8 h-8"
                aria-label="Custom Log Amount"
                on:click|preventDefault={handleModal}
                on:touchend|preventDefault={handleModal}
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="#155e75" viewBox="0 0 24 24"> 
                    <path d="m5.8 21l1.6-7L2 9.2l7.2-.6L12 2l2.8 6.6l7.2.6l-3.2 2.8H18c-3.1 0-5.6 2.3-6 5.3zM17 14v3h-3v2h3v3h2v-3h3v-2h-3v-3z" />
                </svg>
            </button>
        </div>
    </div>

    <div class="absolute z-10 w-full h-[120px] xs:h-full" style="left:0; top: 0;">
        <div class="wave" style="--wave-height: {waterLevel}%; --svg-height: 160"  />
    </div>
</section>
