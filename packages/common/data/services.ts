import { db } from './db'
import { createDailyLog } from './defaults'
import { getDateKey } from 'common/utils/date'
import type { SETTINGS, LOG } from 'common/types'

export const  LogsService = {
    getByDate: async () => {
        const key = getDateKey()
        const log = await db.logs.get({ date_id: key })
        return log
    },

    load: async (settingsData?: SETTINGS) => {
        let log = await LogsService.getByDate()

        if (!log) {
            const settings = await SettingsService.load(settingsData)
            const newLog = createDailyLog(settings)
            log = await db.logs.add(newLog)
        }

        return log
    },

    update: async (log: LOG) => {
        await db.logs.put(log)
    }
}

export const SettingsService = {
    load: async (settingsData?: SETTINGS) => {
        const settings = await db.settings.toArray()
        if (!settings?.[0]) await SettingsService.create(settingsData)

        return settings[0] ?? settingsData
    },

    create: async (settings: SETTINGS) => {
        await db.settings.add(settings)
        return settings
    },

    // Fields in LOG must be in sync with SETTINGS
    update: async (settings: SETTINGS) => {
        const log = await LogsService.load(settings)
        log.amount = settings.amount
        log.goal = settings.goal
        log.measurement = settings.measurement
        
        await LogsService.update(log)
        await db.settings.put(settings)
        return settings
    }
}
