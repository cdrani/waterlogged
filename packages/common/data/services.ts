import { db } from './db'
import type { SETTINGS, LOG, INTAKE } from 'common/types'
import { createIntake, createDailyLog } from './defaults'
import { convertToDate, getDateKey, convertTo24HourFormat } from 'common/utils/date'

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
            log = createDailyLog(settings)
            await db.logs.add(log)
        }

        return log
    },

    update: async (log: LOG) => {
        await db.logs.put(log)
    },

    removeLogIntake: async (intakeId: string) => {
        const log = await LogsService.getByDate()
        const intakes = log.intakes.filter(({ id }) => id !== intakeId)
        log.intakes = intakes
        await LogsService.logIntakeUpdate(log)
    },

    addLogIntake: async () => {
        const log = await LogsService.getByDate()
        const { id: log_id, amount } = log
        const intake = createIntake({ log_id, amount }) 
        log.intakes = [intake, ...log.intakes]

        await LogsService.logIntakeUpdate(log)
    },

    findInsertionIndex(times: string[], newTime: string) {
        const newDateTime = convertToDate(newTime)

        for (let i = 0; i < times.length; i++) {
            if (newDateTime >= convertToDate(times[i])) {
                return i
            }
        }
        return times.length
    },

    addCustomLogIntake: async ({ amount, time }: INTAKE) => {
        const log = await LogsService.getByDate()
        const { id: log_id, intakes } = log

        const formatedLogTimes = intakes.map(({ time }: INTAKE) => convertTo24HourFormat(time))
        const insertIndex = LogsService.findInsertionIndex(formatedLogTimes, time)
        intakes.splice(insertIndex, 0, createIntake({ log_id, amount, time }))

        log.intakes = intakes
        await LogsService.logIntakeUpdate(log)
    },

    logIntakeUpdate: async (log: LOG) => {
        const total = log.intakes.reduce((acc, curr) => acc + Number(curr.amount), 0)
        log.total = total
        log.complete = total >= log.goal
        await LogsService.update(log)
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

    updateKeyValue: async ({ key, value }) => {
        const settings = await SettingsService.load()

        settings[key] = value
        if (['interval', 'goal', 'amount'].includes(key)) {
            await SettingsService.syncWithLog(settings)
        }

        await SettingsService.update(settings)
    },

    // Fields in LOG must be in sync with SETTINGS
    syncWithLog: async (settings: SETTINGS) => {
        const log = await LogsService.load(settings)
        log.amount = settings.amount
        log.goal = settings.goal
        log.measurement = settings.measurement
        
        await LogsService.update(log)
    },

    update: async (settings: SETTINGS) => {
        await db.settings.put(settings)
        return settings
    }
}
