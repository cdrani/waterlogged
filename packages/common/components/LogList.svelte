<script lang="ts">
    import { liveQuery } from 'dexie'
    import { LogsService } from '../data/services'
    import CurrentTime from 'common/components/CurrentTime.svelte'

    async function removeIntake(intakeId: string) {
        await LogsService.removeLogIntake(intakeId)
    }

    let log = liveQuery(async () => await LogsService.getByDate())
</script>

{#if $log}
    <section class="flex relative left-0 flex-col pt-3 w-full mx-auto h-[220px] xs:h-full xs:overflow-y-scroll xs:overflow-hidden">
        <div class="flex justify-between items-center sticky px-4 w-full pb-0 font-semibold">
            <CurrentTime format="date" />
            <h2 class="text-[18px]">({$log?.intakes?.length ?? 0})</h2>
        </div>

        <div class="relative flex flex-col pt-2 overflow-y-auto px-4 w-[280px] xs:w-full h-full pb-4 md:pb-10">
            {#if !($log?.intakes?.length ?? 0)}
                <div class="flex flex-col w-full items-center justify-center h-[180px]">
                    <h4 class="text-xl text-center">
                        No tracked water breaks today. Good chance to take a water break!
                    </h4>
                </div>
            {:else}
                <ul class="relative flex flex-col gap-2 w-[248px] xs:w-full xs:pb-16 md:pb-10">
                    {#each $log?.intakes as intake, i (i)}
                        <li class="rounded-md flex gap-x-2 h-12 bg-cyan-500 items-center p-2">
                            <div class="flex w-full justify-between items-center">
                                <p class="font-bold text-lg">{intake.time}</p>
                                <p class="font-bold text-lg">{intake.amount}{$log.measurement}</p>
                            </div>

                            <button 
                                class="w-6 h-6 justify-end"
                                on:click={() => removeIntake(intake.id)}
                                on:touchend={() => removeIntake(intake.id)}
                            >
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
{/if}
