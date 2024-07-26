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
            databaseUrl: process.env.DEXIE_DB_RL,
        })

        this.on('ready', async () => await populate(this))
    }
}

export const db = new DB()

async function populate(db: DB) {
    const numOfUsers = await db.user.count()
    if (numOfUsers > 0) return

    await db.user.add({
        id: uuidv4(),
        synced: false,
        created: new Date()
    })

    const settings = createSettings()
    const log = createDailyLog(settings)

    await db.settings.add(settings)
    await db.logs.add(log)
}
