<script lang="ts">
    import CurrentTime from './CurrentTime.svelte'

    export let store: any;

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
                    <li class="flex gap-x-2 h-12">
                        <div class="flex w-full justify-between items-center bg-cyan-500 p-2">
                            <p class="font-bold text-lg">{item.time}</p>
                            <p class="font-bold text-lg">{item.amount}{$today.measurement}</p>
                        </div>
                    </li>
                {/each}
            </ul>
        {/if}
    </div>
</section>
