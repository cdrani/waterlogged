import { v4 as uuidv4 } from 'uuid'
import type { INTAKE, LOG, SETTINGS } from 'common/types'
import { formatTime, getDateKey, getTimeStamp } from '../utils/date'

export const createIntake = ({ log_id, time, amount }: Partial<INTAKE>): INTAKE => ({
    amount,
    log_id,
    id: uuidv4(),
    created: new Date(),
    time_stamp: Date.now(),
    time: time ? formatTime(time) : getTimeStamp(),
})

export const createDailyLog = ({ user_id, goal, amount, measurement }: Partial<LOG>): LOG => ({
    user_id,
    goal,
    amount,
    measurement,

    id: uuidv4(),
    complete: false,
    created: new Date(),
    date_id: getDateKey(),
    intakes: [],
})

export const createSettings = ({ user_id }: Partial<SETTINGS>): SETTINGS => ({
    id: uuidv4(),
    user_id,
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
