<script lang="ts">
    import { liveQuery } from 'dexie'
    import { writable } from 'svelte/store'
    import { LogsService } from 'common/data/services'
    import CurrentTime from 'common/components/CurrentTime.svelte'
    import EditLogForm from 'common/components//forms/log/EditLogForm.svelte'

    async function removeIntake(intakeId: string) {
        await LogsService.removeLogIntake(intakeId)
    }

    let selectedId = writable<string | null>(null)

    const onOpen = (intakeId: string) => {
        selectedId.set(intakeId)
    }

    const onClose = () => {
        selectedId.set(null)
    }

    let log = liveQuery(async () => await LogsService.getByDate())
</script>

{#if $log}
    <section class="relative pt-3 w-full mx-auto h-full rounded-b-md bg-cyan-200 overflow-y-hidden">
        <div class="flex justify-between items-center px-4 xs:px-6 w-full pb-0 font-semibold bg-cyan-200">
            <CurrentTime format="date" />
            <h2 class="text-[18px]">({$log?.intakes?.length ?? 0})</h2>
        </div>

        {#if $selectedId} 
            <EditLogForm intakeId={$selectedId} onClose={onClose} />
        {/if}

        <div class="relative flex flex-col pt-2 overflow-y-auto px-4 xs:px-6 w-[280px] xs:w-full h-full pb-4 md:pb-10 bg-transparent">
            {#if !($log?.intakes?.length ?? 0)}
                <div class="flex flex-col w-full items-center justify-center h-[180px]">
                    <h4 class="text-xl text-center">
                        No tracked water breaks today. Good chance to take a water break!
                    </h4>
                </div>
            {:else}
                <ul class="relative flex flex-col gap-2 w-[248px] xs:w-full pb-6 xs:pb-16 md:pb-4">
                    {#each $log?.intakes as intake, i (i)}
                        <li class="rounded-md flex gap-x-2 h-12 bg-cyan-500 items-center p-2">
                            <div class="flex w-full justify-between items-center">
                                <p class="font-bold text-lg">{intake.time}</p>
                                <p class="font-bold text-lg">{intake.amount}{$log.measurement}</p>
                            </div>

                            <div class="flex justify-end items-center pl-2">
                                <button 
                                    name="Edit Log Item"
                                    on:click|preventDefault={() => onOpen(intake.id)}
                                    on:touchend|preventDefault={() => onOpen(intake.id)}
                                    class="w-6 h-6 justify-end"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                        <path fill="currentColor" d="M4 20v-2.52L17.18 4.288q.155-.137.34-.212T17.907 4t.39.064q.19.063.35.228l1.067 1.074q.165.159.226.35q.06.19.06.38q0 .204-.068.39q-.069.185-.218.339L6.519 20zM17.504 7.589L19 6.111L17.889 5l-1.477 1.496z" />
                                    </svg>
                                </button>

                                <button 
                                    name="Delete Log Item"
                                    class="w-6 h-6 justify-end"
                                    on:click|preventDefault={() => removeIntake(intake.id)}
                                    on:touchend|preventDefault={() => removeIntake(intake.id)}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                        <g fill="none" stroke="black" stroke-dasharray="22" stroke-dashoffset="0" stroke-linecap="round" stroke-width="3px">
                                            <path d="M19 5L5 19" />
                                            <path d="M5 5L19 19" />
                                        </g>
                                    </svg>
                                </button>
                            </div>
                        </li>
                    {/each}
                </ul>
            {/if}
        </div>
    </section>
{/if}
