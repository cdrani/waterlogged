<script lang="ts">
    import { liveQuery } from 'dexie'
    import { writable } from 'svelte/store'
    import { type LOG } from 'common/types/index.d'
    import { LogsService } from 'common/data/services'
    import Graph from 'common/components/graph/Graph.svelte'

    export let log: LOG

    const start = new Date()
    start.setMonth(0, 1)
    start.setHours(0, 0, 0, 0)

    const end = new Date()
    end.setMonth(11, 31)

    let logs = liveQuery(async () => await LogsService.all())
    let data = new Map()
    let waterDrank: number
    let logIntakes: number

    let viewingLog = writable<LOG>(log)

    function handleCellClick(dateId: string) {
        const clickedLog = $logs.find((log: LOG) => log.date_id == dateId)
        viewingLog.set(clickedLog)
    }

    $: if ($logs) {
        $logs.forEach((log: LOG) => { data.set(log.date_id, log.intakes.length) })

        logIntakes = $logs.reduce((acc: number, log: LOG) => acc + log.intakes.length, 0)
        waterDrank = $logs.reduce((acc: number, log: LOG) => acc + log.intakes.reduce((acc, intake) => acc + intake.amount, 0), 0)
    }
</script>


{#if $logs}
    <section class="relative flex flex-col w-full h-[340px] lg:h-full xs:h-screen xs:max-h-max bg-cyan-200 rounded-md overflow-y-auto">
        <div class="relative flex justify-between mb-1 w-[248px] xs:w-full mx-auto xs:px-4 md:py-6 md:px-8">
            <div class="text-[14px] xs:text-lg font-semibold">Logs: {logIntakes}</div>
            <div class="text-[14px] xs:text-lg font-semibold">Drank: {waterDrank}ml</div>
        </div>

        <div class="relative mx-4 lg:mx-0 md:px-8">
            <div class="relative w-[248px] xs:w-full xs:max-h-[180px] xs:max-w-3xl rounded-md bg-cyan-800 overflow-x-auto overflow-y-hidden mx-auto p-3 lg:max-w-none lg:px-6">
                <Graph 
                    data={data}
                    view={'yearly'}
                    fontSize={24}
                    fontColor="white"
                    cellGap={8}
                    monthGap={20}
                    endDate={end}
                    startDate={start}
                    cellSize={28}
                    cellRadius={2}
                    dayLabelWidth={64}
                    monthLabelHeight={32}
                    cellClick={handleCellClick}
                    dayLabels={['', 'Mon', '', 'Wed', '', 'Fri', '']}
                    colors={['#404040', '#303030', '#202020', '#101010']}
                />
            </div>
        </div>

        {#if $viewingLog?.intakes?.length}
            <div class="relative flex flex-row justify-between items-center my-1 p-2 px-4 xs:px-6 md:px-8">
                <div class="flex flex-col">
                    <span class="text-sm xs:text-lg font-semibold">{$viewingLog.date_id}</span>
                    <span class="text-sm xs:text-lg font-semibold">total: {$viewingLog.total}ml</span>
                </div>
                <div class="flex flex-col justify-end self-end">
                    <span class="text-sm xs:text-lg font-semibold text-end">goal: {$viewingLog.goal}ml</span>
                    <span class="text-sm xs:text-lg  font-semibold">complete: {$viewingLog.complete}</span>
                </div>
            </div>

            <div class="relative flex sm:overflow-y-auto w-full h-full px-4 lg:px-6">
                <ul class="relative flex flex-col gap-2 pb-8 lg:pb-10 w-full h-screen">
                    {#each $viewingLog?.intakes as intake, i (i)}
                        <li class="rounded-md flex gap-x-2 h-12 bg-cyan-500 items-center p-2 lg:px-6">
                            <div class="flex w-full justify-between items-center">
                                <p class="font-bold text-lg">{intake.time}</p>
                                <p class="font-bold text-lg">{intake.amount}{$viewingLog.measurement}</p>
                            </div>
                        </li>
                    {/each}
                </ul>
            </div>
        {:else}
            <div class="flex flex-col w-full items-center justify-center h-[180px]">
                <h4 class="text-xl md:text-2xl lg:text-3xl text-center">
                {$viewingLog && !$viewingLog?.intakes?.length ? 'No tracked water breaks on this day.' : 'Select a date to display logs for chosen date.'}
                </h4>
            </div>
        {/if}
    </section>
{/if}
