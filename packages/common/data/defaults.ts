import { v4 as uuidv4 } from 'uuid'
import type { INTAKE, LOG, SETTINGS } from 'common/types'
import { formatTime, getDateKey, getTimeStamp } from 'common/utils/date'

export const createIntake = ({ log_id, time, amount }: Partial<INTAKE>): INTAKE => ({
    id: uuidv4(),
    amount,
    log_id,
    created: new Date(),
    time_stamp: Date.now(),
    time: time ? formatTime(time) : getTimeStamp(),
})

export const createDailyLog = ({ goal, amount, measurement }: Partial<LOG>): LOG => ({
    id: uuidv4(),
    goal,
    amount,
    total: 0,
    measurement,
    complete: false,
    created: new Date(),
    date_id: getDateKey(),
    intakes: [],
})

export const createSettings = (): SETTINGS => ({
    id: uuidv4(),
    created: new Date(),
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
