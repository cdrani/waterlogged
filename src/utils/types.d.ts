export type ALERT = 'notify' | 'alarm' | 'both' | 'none'

export type SETTINGS = {
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

export type LOG = {
    time: string,
    amount: number,
}

export type TODAY = {
    logs: LOG[],
    goal: number,
    amount: number,
    measurement: 'ml' | 'cup',
}


type DEFAULT_STORAGE = {
    today: TODAY,
    settings: SETTINGS,
}

type DAILY_DATA = Record<string, TODAY>

export type STORAGE_DATA = DEFAULTSTORAGE & DAILY_DATA

export type ERROR_REASON = { error: chrome.runtime.LastError }

export type STATE_RESOLVER = {
    resolve: (value?: unknown) => void,
    reject: (reason?: ErrorReason) => void,
    result?: Partial<StorageData> | null,
    values?: Partial<StorageData> | null
}

export type TODAY_RESPONSE = { today: TODAY }
export type SETTINGS_RESPONSE = { settings: SETTINGS }
export type DAILY_RESPONSE = { [key: string]: TODAY } // key pattern is YYYY-MM-DD
export type STORAGE_RESPONSE = SETTINGS_RESPONSE | TODAY_RESPONSE | null
