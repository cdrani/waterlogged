<script lang="ts">
    import { getToday } from '../stores/today'
    import { openModal } from '../stores/modal'
    import type TodayStore from '../stores/today'

    import CurrentTime from 'common/components/CurrentTime.svelte'

    const store = getToday() as TodayStore

    function showAddModal() {
        openModal('add')
    }

    $: today = store.today
    $: total = store.total
    $: waterLevel = store.waterLevel
</script>

<section class="overflow-hidden rounded-md relative -z-100 bg-cyan-500 flex flex-col p-4 w-full h-[120px]">
    <div class="flex relative z-10 w-full justify-between">
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

    <div class="flex absolute z-10 bottom-2 h-6 w-1/2">
        <div class="flex gap-x-2 w-full">
            <button on:click={() => store.logAmount(true)} class="w-6 h-6">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path class="fill-cyan-800" d="M17 13h-4v4h-2v-4H7v-2h4V7h2v4h4m-5-9A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2" />
                </svg>
            </button>

            <button on:click={showAddModal} class="w-6 h-6">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path class="fill-cyan-800" d="m5.8 21l1.6-7L2 9.2l7.2-.6L12 2l2.8 6.6l7.2.6l-3.2 2.8H18c-3.1 0-5.6 2.3-6 5.3zM17 14v3h-3v2h3v3h2v-3h3v-2h-3v-3z" />
                </svg>
            </button>
        </div>
    </div>

    <div class="flex z-0 absolute left-0 bottom-0 w-full h-[120px] overflow-hidden">
        <div class="wave" style="--wave-height: {Math.max(0, $waterLevel)}%" />
    </div>
</section>
