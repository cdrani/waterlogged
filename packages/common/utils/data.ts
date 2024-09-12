import download from 'downloadjs'
import { db } from 'common/data/db'

export const FILE_NAME = 'WTL-backup.json'

export async function getDBAsBlob() {
    const blob = await db.export({ 
        prettyJson: true,
        filter: (table: any) => !['$logins', '$syncState'].includes(table),
    })

    return blob
}

// For web & extension
export async function downloadBackUp() {
    if (typeof window !== 'undefined') {
        await import('dexie-export-import')
    }

    const blob = await getDBAsBlob()
    download(blob, FILE_NAME, 'application/json')
}
