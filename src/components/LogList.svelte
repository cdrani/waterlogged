<script lang="ts">
    import { getToday } from '../stores/today'
    import CurrentTime from './CurrentTime.svelte'

    const store = getToday()

    function handleRemove(e: MouseEvent) {
        const button = e.currentTarget 
        const index = button.getAttribute('data-index') 
        store.logIntake(false, index)
    }

    $: today = store.today
</script>

<section class="flex absolute left-0 flex-col mt-2 mx-auto w-[280px] h-[220px]">
    <div class="flex justify-between items-center sticky top-0 mx-auto w-full px-4 font-semibold mb-1.5">
        <CurrentTime format="date" />
        <h2 class="text-[18px]">({$today.logs.length})</h2>
    </div>

    <div class="relative left-0 flex flex-col p-4 pt-0 overflow-y-auto w-full mx-auto">
        {#if !$today?.logs?.length}
            <div class="flex flex-col w-full items-center justify-center h-[180px]">
                <h4 class="text-xl text-center">
                    No tracked water breaks today. Good chance to take a water break!
                </h4>
            </div>
        {:else}
            <ul class="relative flex flex-col gap-2 w-full mx-auto">
                {#each $today?.logs as item, i (i)}
                    <li class="flex gap-x-2 h-12 bg-cyan-500 items-center p-2">
                        <div class="flex w-full justify-between items-center">
                            <p class="font-bold text-lg">{item.time}</p>
                            <p class="font-bold text-lg">{item.amount}{$today.measurement}</p>
                        </div>
                        <button data-index={i} class="w-6 h-6 justify-end" on:click={handleRemove}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <g fill="none" stroke="black" stroke-dasharray="22" stroke-dashoffset="22" stroke-linecap="round" stroke-width="3px">
                                    <path d="M19 5L5 19">
                                        <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.3s" dur="0.3s" values="22;0" />
                                    </path>
                                    <path d="M5 5L19 19">
                                        <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.3s" values="22;0" />
                                    </path>
                                </g>
                            </svg>
                        </button>
                    </li>
                {/each}
            </ul>
        {/if}
    </div>
</section>
