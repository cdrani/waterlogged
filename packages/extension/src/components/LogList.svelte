<script lang="ts">
    import { getToday } from '../stores/today'
    import type TodayStore from '../stores/today'
    import CurrentTime from 'common/components/CurrentTime.svelte'

    const store = getToday() as TodayStore

    function handleRemove(e: MouseEvent) {
        const button = e.target as HTMLButtonElement
        const index = button.getAttribute('data-index') 
        store.logAmount(false, Number(index))
    }

    $: today = store.today
</script>

<section class="flex relative left-0 flex-col pt-3 w-full mx-auto h-[220px] bg-cyan-200">
    <div class="flex justify-between items-center sticky px-4 w-full pb-0 font-semibold">
        <CurrentTime format="date" />
        <h2 class="text-[18px]">({$today.logs.length})</h2>
    </div>

    <div class="relative left-0 flex flex-col pt-2 overflow-y-auto px-4 w-[280px] h-full mx-auto">
        {#if !$today?.logs?.length}
            <div class="flex flex-col w-full items-center justify-center h-[180px]">
                <h4 class="text-xl text-center">
                    No tracked water breaks today. Good chance to take a water break!
                </h4>
            </div>
        {:else}
            <ul class="relative flex flex-col gap-2 pb-4 w-[248px]">
                {#each $today?.logs as item, i (i)}
                    <li class="rounded-md flex gap-x-2 h-12 bg-cyan-500 items-center p-2">
                        <div class="flex w-full justify-between items-center">
                            <p class="font-bold text-lg">{item.time}</p>
                            <p class="font-bold text-lg">{item.amount}{$today.measurement}</p>
                        </div>
                        <button data-index={i} class="w-6 h-6 justify-end" on:click={handleRemove}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <g fill="none" stroke="black" stroke-dasharray="22" stroke-dashoffset="0" stroke-linecap="round" stroke-width="3px">
                                    <path d="M19 5L5 19" />
                                    <path d="M5 5L19 19" />
                                </g>
                            </svg>
                        </button>
                    </li>
                {/each}
            </ul>
        {/if}
    </div>
</section>
