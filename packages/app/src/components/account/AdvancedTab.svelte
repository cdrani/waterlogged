<script lang="ts">
    import { invoke } from '@tauri-apps/api/core'
    import { importDB } from 'dexie-export-import'
    import { join, downloadDir } from '@tauri-apps/api/path'

    import { db } from 'common/data/db'
    import DBData from 'common/components/DBData.svelte'
    import { FILE_NAME, getDBAsBlob } from 'common/utils/data'

    async function exportData() {
        const blob =  await getDBAsBlob()
        if (!blob) return
        const content = await blob?.text()

        const folder = await downloadDir()
        const filePath = await join(folder, FILE_NAME)
        await invoke('download_backup', { filePath, content: content })
    }

    async function importData(file: File) {
        await db.delete()
        await importDB(file)
    }
</script>

<DBData {exportData} {importData} />
