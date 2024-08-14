<script lang="ts">
    import { liveQuery } from 'dexie'
    import { writable } from 'svelte/store'

    import FormActions from './FormActions.svelte'

    import type { INTAKE } from 'common/types'
    import { getTime } from 'common/utils/date'
    import { closeModal } from 'common/stores/modal'
    import { LogsService } from 'common/data/services'

    const inputClass = 'px-0.5 pl-2 h-7 text-[14px] xs:text-md md:text-lg font-semibold rounded-[4px]'

    async function saveCustomLog() {
        LogsService.addCustomLogIntake($params as INTAKE)
        closeModal()
    }

    const log = liveQuery(async () => await LogsService.getByDate())
    let params = writable<{ time: string, amount: number }>({ time: getTime(), amount: $log?.amount ?? 250 })
</script>

{#if $log}
    <form on:submit|preventDefault={saveCustomLog} class="absolute flex flex-col w-full h-full gap-6 p-10">
        <h1 class="text-center text-white text-xl lg:text-2xl font-bold">Log Custom Amount</h1>
        <div class="flex flex-col justify-between w-full gap-x-6 gap-4 mt-4">
            <label for="time" class="flex justify-between items-center gap-y-1">
                <span class="text-white text-md md:text-lg font-bold">Log Time</span>
                <input
                    id="time"
                    type="time" 
                    name="time"
                    bind:value={$params.time}
                    class="{inputClass} w-1/2"
                />
            </label>

            <label for="amount" class="flex justify-between items-center gap-y-1">
                <span class="text-white text-md md:text-lg font-bold">Amount ({$log.measurement})</span>
                <input 
                    id="amount"
                    name="amount"
                    type="number"
                    class="{inputClass} w-1/2"
                    bind:value={$params.amount}
                />
            </label>
        </div>

        <FormActions onClose={closeModal} />
    </form>
{/if}
