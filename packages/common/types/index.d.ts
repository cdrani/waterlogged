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
    measurement: string,
}

export type INTAKES = DEFAULT_MODEL_TYPE & {
    time: string,
    amount: number,
    log_id: string,
}

export type LOGS = DEFAULT_MODEL_TYPE & {
    user_id: string,

    intakes: INTAKES[],
    goal: number,
    amount: number,
    measurement: 'ml' | 'cup',
}
