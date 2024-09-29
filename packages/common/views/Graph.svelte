<script lang="ts">
    import { liveQuery } from 'dexie'
    import { writable } from 'svelte/store'

    import { getDateKey } from 'common/utils/date'
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
    let data = writable<Map<string, number>>(new Map())
    let waterDrank: number
    let logIntakes: number

    let dateKey = writable<string>(getDateKey())
    let todayLog = writable<LOG>(log)
    let viewingLog = writable<LOG>(log)

    function handleCellClick(dateId: string) {
        dateKey.set(dateId)

        if (dateId == $todayLog.date_id) return viewingLog.set($todayLog)

        const clickedLog = $logs.find((log: LOG) => log.date_id == dateId)
        viewingLog.set(clickedLog)
    }

    $: if (log.intakes.length !== $todayLog.intakes.length) {
        todayLog.set(log)
        if ($viewingLog?.date_id == log.date_id) viewingLog.set(log)
    }

    $: if ($logs) {
        $logs.forEach((log: LOG) => {
            data.update(datum => {
                datum.set(log.date_id, log.intakes.length)
                return datum
            })
        })

        logIntakes = $logs.reduce((acc: number, log: LOG) => acc + log.intakes.length, 0)
        waterDrank = $logs.reduce((acc: number, log: LOG) => acc + log.intakes.reduce((acc, intake) => acc + intake.amount, 0), 0)
    }
</script>

{#if $logs}
    <section class="relative flex flex-col w-full h-full xs:pb-6 md:pb-0 md:rounded-md overflow-y-auto">
        <div class="flex flex-col bg-cyan-200 w-full h-full">
            <div class="relative flex justify-between w-full mx-auto px-4 xs:px-6 md:py-6 md:px-8">
                <div class="text-base xs:text-lg font-semibold">Logs: {logIntakes}</div>
                <div class="text-base xs:text-lg font-semibold">Drank: {waterDrank}ml</div>
            </div>

            <div class="relative px-4 py-2.5 md:pt-4 xs:px-6 md:px-8">
                <div class="relative w-[248px] xs:w-full xs:max-h-[180px] xs:max-w-3xl rounded-md bg-cyan-800 overflow-x-auto overflow-y-hidden mx-auto lg:max-w-none">
                    <Graph 
                        data={$data}
                        view={'yearly'}
                        fontSize={26}
                        fontColor="white"
                        cellGap={8}
                        monthGap={20}
                        endDate={end}
                        startDate={start}
                        cellSize={28}
                        cellRadius={2}
                        dayLabelWidth={72}
                        monthLabelHeight={40}
                        cellClick={handleCellClick}
                        dayLabels={['', 'Mon', '', 'Wed', '', 'Fri', '']}
                        colors={['#404040', '#303030', '#202020', '#101010']}
                    />
                </div>
            </div>

            {#if $viewingLog?.intakes?.length}
                <div class="relative flex flex-row justify-between items-center my-1 p-2 px-4 xs:px-6 md:px-8">
                    <div class="flex flex-col">
                        <span class="text-base xs:text-lg font-semibold">{$viewingLog.date_id}</span>
                        <span class="text-base xs:text-lg font-semibold">total: {$viewingLog.total}ml</span>
                    </div>
                    <div class="flex flex-col justify-end self-end">
                        <span class="text-base xs:text-lg font-semibold text-end">goal: {$viewingLog.goal}ml</span>
                        <span class="text-base xs:text-lg  font-semibold">complete: {$viewingLog.complete}</span>
                    </div>
                </div>

                <div class="relative flex lg:overflow-y-auto w-full h-full pb-4 sm:pb-0">
                    <ul class="relative flex flex-col gap-2 lg:pb-6 overflow-hidden sm:overflow-y-auto px-4 xs:px-6 w-full h-full">
                        {#each $viewingLog?.intakes as intake, i (i)}
                            <li class="rounded-md flex gap-x-2 h-12 bg-cyan-500 items-center p-4 lg:px-6">
                                <div class="flex w-full justify-between items-center">
                                    <p class="font-bold text-lg">{intake.time}</p>
                                    <p class="font-bold text-lg">{intake.amount}{$viewingLog.measurement}</p>
                                </div>
                            </li>
                        {/each}
                    </ul>
                </div>
            {:else}
                <div class="flex flex-col w-full items-center justify-center xs:h-[180px] p-4 lg:px-6">
                    <h4 class="font-semibold text-xl md:text-2xl lg:text-3xl text-center">
                        {$viewingLog && !$viewingLog?.intakes?.length
                            ? `No tracked water breaks on ${$dateKey}.`
                            : `No tracked logs for ${$dateKey}. Try selecting another date.`}
                    </h4>
                </div>
            {/if}
        </div>
    </section>
{/if}
