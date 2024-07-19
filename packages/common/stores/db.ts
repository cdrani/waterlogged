import dexieCloud from 'dexie-cloud-addon'
import Dexie, { Table } from 'dexie'
import { v4 as uuidv4 } from 'uuid'

import type { LOGS, USER, SETTINGS, INTAKES } from '../types/index.d'

export class DB extends Dexie {
    user!: Table<USER>
    logs!: Table<LOGS>
    intakes!: Table<INTAKES>
    settings!: Table<SETTINGS>

    constructor() {
        super('waterlogged', { addons: [dexieCloud], cache: 'immutable' })

        this.version(1).stores({
            user: 'id, created',
            logs: 'id, user_id, created',
            intakes: 'id, log_id, created',
            settings: 'id, user_id, created',
        })

        // TODO: reconfigure when cloud setup
        // this.cloud.configure({
        //     databaseUrl: '',
        //     requireAuth: false,
        //     customLoginGui: false,
        // })

        this.on('populate', () => {
            this.on('ready', () => populate(this))
        })
    }
}

export const db = new DB()

async function populate(db: DB) {
    const numOfUsers = await db.user.count()

    if (numOfUsers > 0) return

    const user = await db.user.add({
        id: uuidv4(),
        synced: false,
        created: new Date()
    })

    await db.logs.add({
        id: uuidv4(),
        created: new Date(),

        user_id: user.id,
        intakes: [],
        goal: 2000,
        amount: 250,
        measurement: 'ml'
    })

    await db.settings.add({
        id: uuidv4(),
        created: new Date(),
        user_id: user.id,

        goal: 2000,
        amount: 250,
        measurement: 'ml',
        sound: 'bubble1',
        enabled: true,
        interval: 60,
        end_time: '18:00',
        alert_type: 'both',
        start_time: '08:00'
    })
}
