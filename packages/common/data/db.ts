// import dexieCloud from 'dexie-cloud-addon'
import Dexie, { Table } from 'dexie'
import { v4 as uuidv4 } from 'uuid'

import type { LOG, USER, SETTINGS, INTAKE } from '../types/index.d'
import { createDailyLog, createSettings } from './defaults'

export class DB extends Dexie {
    user!: Table<USER>
    logs!: Table<LOG>
    intakes!: Table<INTAKE>
    settings!: Table<SETTINGS>

    constructor() {
        super('waterlogged')//, { addons: [dexieCloud], cache: 'immutable' })

        this.version(1).stores({
            user: 'id, created',
            settings: 'id, user_id, created',
            intakes: 'id, log_id, time_stamp',
            logs: 'id, user_id, date_id, created',
        })

        // TODO: reconfigure when cloud setup
        // this.cloud.configure({
        //     databaseUrl: '',
        //     requireAuth: false,
        //     customLoginGui: false,
        // })

        this.on('ready', async () => await populate(this))
    }
}

export const db = new DB()

async function populate(db: DB) {
    const numOfUsers = await db.user.count()
    if (numOfUsers > 0) return

    const user_id = uuidv4()

    await db.user.add({
        id: user_id,
        synced: false,
        created: new Date()
    })

    const settings = createSettings({ user_id })
    const log = createDailyLog(settings)

    await db.settings.add(settings)
    await db.logs.add(log)
}
