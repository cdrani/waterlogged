import download from 'downloadjs'
import { db } from 'common/data/db'
import { exportDB, } from 'dexie-export-import'

export const FILE_NAME = 'WTL-backup.json'

export async function getDBAsBlob() {
    const blob = await exportDB(db, { 
        prettyJson: true,
        filter: (table: any) => !['$logins', '$syncState'].includes(table),
    })

    return blob
}

// For web & extension
export async function downloadBackUp() {
    const blob = await getDBAsBlob()
    download(blob, FILE_NAME, 'application/json')
}
