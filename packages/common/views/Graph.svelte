<script lang="ts">
    import { liveQuery } from 'dexie'
    import { writable } from 'svelte/store'
    import { type LOG } from 'common/types/index.d'
    import { LogsService } from 'common/data/services'
    import Graph from 'common/components/graph/Graph.svelte'

    const start = new Date()
    start.setMonth(6, 1)
    start.setHours(0, 0, 0, 0)

    const end = new Date()
    end.setMonth(11, 31)

    let logs = liveQuery(async () => await LogsService.all())
    let data = new Map()
    let waterDrank: number
    let logIntakes: number

    let viewingLog = writable<LOG>(null)

    function handleCellClick(dateId: string) {
        const clickedLog = $logs.find((log: LOG) => log.date_id == dateId)
        viewingLog.set(clickedLog)
    }

    $: if ($logs) {
        $logs.forEach((log: LOG) => {
            data.set(log.date_id, log.intakes.length)
        })

        logIntakes = $logs.reduce((acc: number, log: LOG) => acc + log.intakes.length, 0)
        waterDrank = $logs.reduce((acc: number, log: LOG) => acc + log.intakes.reduce((acc, intake) => acc + intake.amount, 0), 0)
    }
</script>

{#if $logs}
    <section class="absolute flex flex-col mx-auto w-full h-[340px] max-h-[358] bg-cyan-200 px-4">
        <div class="flex w-full justify-between pb-2">
            <div class="text-[12px] font-semibold">Logs: {logIntakes}</div>
            <div class="text-[12px] font-semibold">Drank: {waterDrank}ml</div>
        </div>
        <div class="relative flex flex-col w-full h-full p-2 rounded-md bg-cyan-800 overflow-x-scroll max-h-[150px]">
            <Graph 
                data={data}
                view={'yearly'}
                fontSize={12}
                fontColor="white"
                cellGap={4}
                endDate={end}
                startDate={start}
                cellSize={12}
                cellRadius={6}
                dayLabelWidth={36}
                monthLabelHeight={20}
                cellClick={handleCellClick}
                dayLabels={['', 'Mon', '', 'Wed', '', 'Fri', '']}
                colors={['#404040', '#303030', '#202020', '#101010']}
            />

            <div 
                id="tooltip"
                class="items-center justify-center absolute z-[2000] hidden h-5 w-full max-w-[120px] rounded-[4px] top-4 border-gray-400 bg-white border-sm py-0.5 px-1 text-[12px]"
            >
                <span></span>
            </div>
        </div>

        {#if $viewingLog?.intakes?.length}
            <div class="flex flex-row justify-between items-center my-1">
                <div class="flex flex-col">
                    <span class="text-sm font-semibold">{$viewingLog.date_id}</span>
                    <span class="text-sm font-semibold">total: {$viewingLog.total}ml</span>
                </div>
                <div class="flex flex-col justify-end self-end">
                    <span class="text-sm font-semibold text-end">goal: {$viewingLog.goal}ml</span>
                    <span class="text-sm font-semibold">complete: {$viewingLog.complete}</span>
                </div>
            </div>
            <div class="relative left-0 flex flex-col overflow-y-auto w-[280px] h-full mx-auto">
                <ul class="relative flex flex-col gap-2 pb-3 w-[248px]">
                    {#each $viewingLog?.intakes as intake, i (i)}
                        <li class="rounded-md flex gap-x-2 h-10 bg-cyan-500 items-center p-2">
                            <div class="flex w-full justify-between items-center">
                                <p class="font-bold text-lg">{intake.time}</p>
                                <p class="font-bold text-lg">{intake.amount}{$viewingLog.measurement}</p>
                            </div>
                        </li>
                    {/each}
                </ul>
            </div>
        {:else if $viewingLog && !$viewingLog.intakes?.length}
            <div class="flex flex-col w-full items-center justify-center h-[180px]">
                <h4 class="text-xl text-center">
                    No tracked water breaks on this day.
                </h4>
            </div>
        {:else}
            <div class="flex flex-col w-full items-center justify-center h-[180px]">
                <h4 class="text-xl text-center">
                    Select a date to display logs for chosen date.
                </h4>
            </div>
        {/if}
    </section>
{/if}
