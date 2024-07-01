import type { SETTINGS, TODAY } from './types.d'

export const SETTINGS_DEFAULT: SETTINGS = {
    goal: 2000,
    amount: 250,
    interval: 60, // minutes
    enabled: true,
    sound: 'bubble1',
    measurement: 'ml',
    end_time: '18:00',
    alert_type: 'both',
    start_time: '08:00',
}

export const TODAY_DEFAULT: TODAY = {
    logs: [],
    goal: 2000,
    amount: 250,
    measurement: 'ml'
}
