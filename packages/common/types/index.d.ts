export type MEASUREMENT = 'cup' | 'ml'
export type ALERT = 'notify' | 'alarm' | 'both' | 'none'

type DEFAULT_MODEL_TYPE = {
    id: string,
    created: Date
}

type TARGET = {
    goal: number,
    amount: number,
    measurement: MEASUREMENT
}

export type USER = DEFAULT_MODEL_TYPE & {
    synced: boolean,
}

export type SETTINGS = DEFAULT_MODEL_TYPE & TARGET & {
    sound: string,
    enabled: boolean,
    interval: number,
    end_time: string,
    alert_type: ALERT,
    start_time: string,
}

export type INTAKE = DEFAULT_MODEL_TYPE & {
    time: string,
    amount: number,
    log_id: string,
    time_stamp: number
}

export type LOG = DEFAULT_MODEL_TYPE & TARGET & {
    date_id: string,
    intakes: INTAKE[],
    complete: boolean,
}

export type LOG_RESPONSE = { log: LOG }
export type SETTINGS_RESPONSE = { settings: SETTINGS }
export type STORAGE_RESPONSE = SETTINGS_RESPONSE | LOG_RESPONSE | null
