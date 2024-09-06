export function getDateKey() {
    return new Intl.DateTimeFormat('sv-SE', { dateStyle: 'short' }).format(new Date())
}

export function getTime(date?: Date) {
    const currentDate = date ?? new Date()
    const minutes = currentDate.getMinutes()
    const hours = currentDate.getHours()
    const paddedMinutes = minutes.toString().padStart(2, '0')
    const paddedHours = hours.toString().padStart(2, '0')
    return `${paddedHours}:${paddedMinutes}`
}

export function getDateMS(timeStr?: string) {
    const date = new Date()
    if (!timeStr) return date.getTime()

    const [hour, min] = timeStr.split(':').map(Number)
    date.setHours(hour)
    date.setMinutes(min)
    date.setSeconds(0)
    return date.getTime()
}

function getLocales(): string[] {
    let locales = ['en-US'] // Default locale

    if (typeof navigator !== 'undefined' && navigator.languages) {
        locales = navigator.languages as string[]
    }

    return locales
}

export function getTimeStamp(date?: Date) {
    return new Intl.DateTimeFormat(getLocales(), { timeStyle: 'short' }).format(date ?? new Date())
}

export function getMediumDate(date?: Date) {
    return new Intl.DateTimeFormat(getLocales(), {
        dateStyle: 'medium',
    }).format(date ?? new Date())
}

export function formatTime(timeString: string): string {
    const [hours, minutes] = timeString.split(':').map(Number)
    const now = new Date()
    now.setHours(hours, minutes, 0, 0)
    return getTimeStamp(now)
}

function splitTimeStr(timeStr: string) {
    const [time, modifier] = timeStr.split(' ')
    const [hours, minutes] = time.split(':')
    return { hours, minutes, modifier }
}

export function convertTo24HourFormat(timeStr: string) {
    let { hours, minutes, modifier } = splitTimeStr(timeStr)
    hours = `${Number(hours)}` // remove zero-padding

    if (hours == '12') { hours = '00' }
    if (modifier === 'PM') { hours = `${Number(hours) + 12}` }
    else { hours = hours.padStart(2, '0') }
    
    return `${hours}:${minutes}`
}

export function convertToDate(timeStr: string) {
    const { hours, minutes, modifier } = splitTimeStr(timeStr)
    let numHour = Number(hours) // remove zero-padding

    if (modifier === 'PM' && numHour !== 12) { numHour += 12 }
    if (modifier === 'AM' && numHour === 12) { numHour = 0 }
    
    const date = new Date()
    date.setHours(numHour)
    date.setMinutes(Number(minutes))
    date.setSeconds(0)
    date.setMilliseconds(0)
    
    return date
}
