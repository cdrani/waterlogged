import type { SETTINGS, TODAY } from './types.d'

export const SETTINGS_DEFAULT: SETTINGS = {
    goal: 1800,
    amount: 250,
    interval: 1, // minutes
    enabled: true,
    sound: 'bubble1',
    measurement: 'ml',
    end_time: '20:00',
    alert_type: 'both',
    start_time: '00:00',
}

export const TODAY_DEFAULT: TODAY = {
    logs: [],
    goal: 1800,
    amount: 250,
    measurement: 'ml'
}
