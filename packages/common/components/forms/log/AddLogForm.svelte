<script lang="ts">
    import { liveQuery } from 'dexie'
    import { writable } from 'svelte/store'

    import Form from  './Form.svelte'
    import type { INTAKE } from 'common/types'
    import { getTime } from 'common/utils/date'
    import { closeModal } from 'common/stores/modal'
    import { LogsService } from 'common/data/services'

    async function saveCustomLog() {
        LogsService.addCustomLogIntake($fields as INTAKE)
        closeModal()
    }

    const log = liveQuery(async () => await LogsService.getByDate())
    let fields = writable<{ time: string, amount: number }>({ time: getTime(), amount: $log?.amount ?? 250 })
</script>

{#if $log}
    <Form onSubmit={saveCustomLog} fields={$fields} onClose={closeModal} />
{/if}
