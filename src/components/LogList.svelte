<script lang="ts">
    import CurrentTime from "./CurrentTime.svelte";
    /*
        {
            daily_goal: 1800,
            measurement: ml (cup)
            date: 'YYYY-MM-DD',
            logs: [
                {
                    at: 'HH:MM'
                    amount: 100,
                },
                {
                    at: 'HH:MM'
                    amount: 100,
                }
                {
                    at: 'HH:MM'
                    amount: 100,
                }
                {
                    at: 'HH:MM'
                    amount: 100,
                }

            ]
        }
    */

    let data = [
        {
            at: "11:10",
            amount: 100,
        },
        {
            at: "12:10",
            amount: 100,
        },
        {
            at: "13:10",
            amount: 100,
        },
        {
            at: "14:10",
            amount: 100,
        },
        {
            at: "15:10",
            amount: 100,
        },
        {
            at: "16:10",
            amount: 100,
        },
        {
            at: "17:10",
            amount: 100,
        },
        {
            at: "18:10",
            amount: 100,
        },
        {
            at: "19:10",
            amount: 100,
        }
    ]

    const timeHeader = 'sticky top-0 mx-auto w-full px-4 text-[18px] font-semibold mb-1.5'
</script>

<section class="flex absolute left-0 flex-col mt-2 mx-auto w-[280px] h-[220px]">
    <CurrentTime format="date" classList={timeHeader} />
    <div class="relative left-0 flex flex-col p-4 pt-0 overflow-y-auto w-full mx-auto">
        {#if data.length == 0}
            <div class="flex flex-col w-full items-center justify-center h-[180px]">
                <h4 class="text-xl text-center">
                    No tracked water breaks today. Good chance to take a water break!
                </h4>
            </div>
        {:else}
            <ul class="relative flex flex-col gap-2 w-full mx-auto">
                {#each data.reverse() as datum, i (i)}
                    <li class="flex gap-x-2 h-12">
                        <div class="flex w-full justify-between items-center bg-cyan-500 p-2">
                            <p class="font-bold text-lg">{datum.at}</p>
                            <p class="font-bold text-lg">{datum.amount}ml</p>
                        </div>
                    </li>
                {/each}
            </ul>
        {/if}
    </div>
</section>
