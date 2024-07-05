export function getDateKey() {
    return new Intl.DateTimeFormat('sv-SE', { dateStyle: 'short' }).format(new Date())
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

export function getTimeStamp(date?: Date) {
    const locales = navigator.languages as string[]
    return new Intl.DateTimeFormat(locales, { timeStyle: 'short' }).format(date ?? new Date())
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

