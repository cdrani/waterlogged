export type MEASUREMENT = 'cup' | 'ml'
export type ALERT = 'notify' | 'alarm' | 'both' | 'none'

type DEFAULT_MODEL_TYPE = {
    id: string, // primary key
    created: Date
}

export type USER = DEFAULT_MODEL_TYPE & {
    synced: boolean,
}

export type SETTINGS = DEFAULT_MODEL_TYPE & {
    user_id: string,
    goal: number,
    sound: string,
    amount: number,
    enabled: boolean,
    interval: number,
    end_time: string,
    alert_type: ALERT,
    start_time: string,
    measurement: MEASUREMENT
}

export type INTAKE = DEFAULT_MODEL_TYPE & {
    time: string,
    amount: number,
    log_id: string,
    time_stamp: number
}

export type LOG = DEFAULT_MODEL_TYPE & {
    user_id: string,

    date_id: string,
    intakes: INTAKE[],
    goal: number,
    amount: number,
    measurement: MEASUREMENT
}

export type LOG_RESPONSE = { log: LOG }
export type SETTINGS_RESPONSE = { settings: SETTINGS }
export type STORAGE_RESPONSE = SETTINGS_RESPONSE | LOG_RESPONSE | null
