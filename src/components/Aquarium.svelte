<script lang="ts">
    import Button from './Button.svelte';
    import CurrentTime from './CurrentTime.svelte';

    export let store: any

    $: today = store.today
    $: total = store.total
    $: waterLevel = store.waterLevel
</script>

<section class="relative -z-100 bg-cyan-500 flex flex-col p-4 w-full h-[120px]">
    <div class="flex relative z-10 mb-4 w-full justify-between">
        <CurrentTime />
        <div class="flex flex-col min-w-[100px] max-w-3/5 items-end">
            <p class="flex justify-between font-semibold text-[14px] text-black w-full">
                <span class="inline-flex text-left">Total:</span>
                <span class="inline-flex justify-end">{$total}{$today.measurement}</span>
            </p>
            <p class="flex justify-between font-semibold text-[14px] text-black w-full">
                <span class="inline-flex text-left">Goal:</span>
                <span class="inline-flex justify-end">{$today.goal}{$today.measurement}</span>
            </p>
        </div>
    </div>
    <div class="flex relative z-10">
        <div class="flex gap-x-4 w-1/2">
            <button on:click={() => store.logIntake(true)} class="w-7 h-7">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path class="fill-cyan-800" d="M17 13h-4v4h-2v-4H7v-2h4V7h2v4h4m-5-9A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2" />
                </svg>
            </button>
        </div>
    </div>

    <div class="flex z-0 absolute left-0 bottom-0 w-full h-[120px] overflow-hidden">
        <div class="wave" style="--wave-height: {Math.max(0, $waterLevel)}%" />
    </div>
</section>
