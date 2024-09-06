<script lang="ts">
    import { liveQuery } from 'dexie'
    import { writable } from 'svelte/store'

    import Form from  './Form.svelte'
    import PopUp from '../../PopUp.svelte'
    import type { INTAKE } from 'common/types'
    import { LogsService } from 'common/data/services'
    import { convertTo24HourFormat, formatTime, getTimeStamp } from 'common/utils/date'

    export let intakeId: string
    export let onClose: () => void

    async function editCustomLog() {
        const { time, amount } = $fields
        LogsService.editLogIntake({ id: intakeId, time: formatTime(time), amount })
        onClose()
    }

    const log = liveQuery(async () => await LogsService.getByDate())
    let fields = writable<{ time: string, amount: number }>({ time: getTimeStamp(), amount: $log?.amount ?? 250 })

    $: if ($log) {
        let selectedIntake = $log.intakes.find((intake: INTAKE) => intake.id == intakeId) as INTAKE
        if (selectedIntake) {
            const time = convertTo24HourFormat(selectedIntake.time)
            fields.update(() => ({ time, amount: selectedIntake.amount }))
        }
    }
</script>

{#if $log} 
    <PopUp onClose={onClose}>
        <Form type="edit" onSubmit={editCustomLog} onClose={onClose} fields={$fields} />
    </PopUp>
{/if}
