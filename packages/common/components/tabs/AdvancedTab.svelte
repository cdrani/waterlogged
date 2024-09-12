<script lang="ts">
    import { onMount } from 'svelte'

    import { db } from 'common/data/db'
    import DBData from '../DBData.svelte'
    import { downloadBackUp } from 'common/utils/data'

    async function exportData() {
        await downloadBackUp()
    }

    async function importData(file: File) {
        await db.delete()
        await db.import(file)
    }

    onMount(async () => {
        await import('dexie-export-import')
    })
</script>

<DBData {exportData} {importData} />
