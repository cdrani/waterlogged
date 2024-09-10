<script lang="ts">
    import { importDB } from 'dexie-export-import'

    import { db } from 'common/data/db'
    import DBData from '../DBData.svelte'
    import { downloadBackUp } from 'common/utils/data'

    async function exportData() {
        await downloadBackUp()
    }

    async function importData(file: File) {
        await db.delete()
        await importDB(file)
    }
</script>

<DBData {exportData} {importData} />
