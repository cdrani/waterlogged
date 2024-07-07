<script lang="ts">
    import CurrentTime from './CurrentTime.svelte'

    export let tank
    export let handleLog: () => void
    export let handleModal: () => void
</script>

<section class="overflow-hidden rounded-md relative -z-100 bg-cyan-500 flex flex-col p-4 w-full h-[120px]">
    <div class="flex relative z-50 w-full h-full justify-between">
        <CurrentTime />
        <div class="flex flex-col min-w-[100px] max-w-3/5 items-end">
            <p class="flex justify-between font-semibold text-[14px] text-black w-full">
                <span class="inline-flex text-left">Total:</span>
                <span class="inline-flex justify-end">{tank.total}{tank.measurement}</span>
            </p>
            <p class="flex justify-between font-semibold text-[14px] text-black w-full">
                <span class="inline-flex text-left">Goal:</span>
                <span class="inline-flex justify-end">{tank.goal}{tank.measurement}</span>
            </p>
        </div>
    </div>

    <div class="relative z-50 bottom-2 h-6 w-full">
        <div class="flex gap-3">
            <button on:click={handleLog} class="w-6 h-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="#155e75"  viewBox="0 0 24 24" width="24" height="24">
                    <path d="M17 13h-4v4h-2v-4H7v-2h4V7h2v4h4m-5-9A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2" />
                </svg>
            </button>

            <button on:click={handleLog} class="w-6 h-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="#155e75" viewBox="0 0 24 24" width="24" height="24"> 
                    <path d="m5.8 21l1.6-7L2 9.2l7.2-.6L12 2l2.8 6.6l7.2.6l-3.2 2.8H18c-3.1 0-5.6 2.3-6 5.3zM17 14v3h-3v2h3v3h2v-3h3v-2h-3v-3z" />
                </svg>
            </button>
        </div>
    </div>

    <div class="absolute -z-10 left-0 bottom-0 w-full h-[120px]">
        <div class="wave" style="--wave-height: {Math.max(0, tank.waterLevel)}%" />
    </div>
</section>
