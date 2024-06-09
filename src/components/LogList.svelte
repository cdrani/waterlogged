<script lang="ts">
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
</script>

<section class="flex flex-col mt-2 overflow-scroll h-[350px]">
    <h4 class="text-[18px] font-semibold mb-2">Sun, Jun 09, 2024</h4>
    <ul class="flex flex-col gap-4 w-full h-full overflow-scroll pb-4">
        {#each data as datum, i (i)}
            <li class="flex gap-4 w-full h-12">
                <div class="flex w-full justify-between items-center bg-cyan-300 p-2 ">
                    <p class="font-bold text-lg">{datum.at}</p>
                    <p class="font-bold text-lg">{datum.amount}ml</p>
                </div>
            </li>
        {/each}
    </ul>
</section>
