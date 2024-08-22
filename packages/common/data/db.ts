import Dexie, { Table } from 'dexie'
import { v4 as uuidv4 } from 'uuid'
import dexieCloud from 'dexie-cloud-addon'

import { createDailyLog, createSettings } from './defaults'
import type { LOG, USER, SETTINGS, INTAKE } from '../types/index.d'

export class DB extends Dexie {
    user!: Table<USER>
    logs!: Table<LOG>
    intakes!: Table<INTAKE>
    settings!: Table<SETTINGS>

    constructor() {
        super('waterlogged', { addons: [dexieCloud], cache: 'immutable' })

        this.version(1).stores({
            user: 'id, created',
            settings: 'id, created',
            logs: 'id, date_id, created',
        })

        this.cloud.configure({
            requireAuth: false,
            customLoginGui: true,
            // @ts-ignore
            databaseUrl: import.meta.env.VITE_DEXIE_DB_URL,
        })

        this.on('ready', async () => await populateDB(this))
    }
}

export const db = new DB()

export async function populateApp(db: DB) {
    const settingsDNE = await db.settings.count() == 0
    if (!settingsDNE) return

    const settings = createSettings()
    const log = createDailyLog(settings)

    await db.settings.add(settings)
    await db.logs.add(log)
}

export async function populateUser(db: DB) {
    await db.user.add({
        id: uuidv4(),
        created: new Date()
    })
}

export async function populateDB(db: DB) {
    const numOfUsers = await db.user.count()
    if (numOfUsers > 0) return

    await populateUser(db)
    await populateApp(db)
}
