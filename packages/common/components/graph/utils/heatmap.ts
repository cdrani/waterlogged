import { getMonthEnd, getMonthStart, getWeekEnd, getWeekStart, normalizeDate, normalizeDateToISO } from './date'

interface CalendarOptions {
    allowOverflow: boolean
    calendar: Array<{ date: Date }>
    endDate: Date | string | number
    startDate: Date | string | number
}

interface GetCalendarProps {
    colors: string[]
    emptyColor: string
    data: Map<string, number>
    view: 'monthly' | 'yearly'
    endDate: Date | string | number
    startDate: Date | string | number
}

interface GetColorOptions {
    max: number
    value: number
    colors: string[]
}

interface GetDayOptions {
    offset: number
    startDate: Date
    startDayOfMonth: number
    data: Map<string, number>
}

export function chunkMonths(
    { allowOverflow, calendar, endDate, startDate }: CalendarOptions
): Array<Array<{ date: Date }>> {
    let prevMonth = -1

    const normalizedStartDate = normalizeDate(startDate)
    const normalizedEndDate = normalizeDate(endDate)

    return calendar.reduce((acc, day) => {
        const currentMonth = day.date.getMonth()

        if (prevMonth !== currentMonth) {
            acc.push([])
            prevMonth = currentMonth
        }

        if (allowOverflow || (
            (!normalizedStartDate || day.date >= normalizedStartDate) && 
                (!normalizedEndDate || day.date <= normalizedEndDate)
        )) {
            acc[acc.length - 1].push(day)
        }

        return acc
    }, [] as Array<Array<{ date: Date }>>)
}

export function chunkWeeks(
    { allowOverflow, calendar, endDate, startDate }: CalendarOptions
): Array<Array<{ date: Date }>> {
    const normalizedStartDate = normalizeDate(startDate)
    const normalizedEndDate = normalizeDate(endDate)

    console.log({ normalizedStartDate, normalizedEndDate })

    return calendar.reduce((acc, day, index) => {
        if (index % 7 === 0) acc.push([])

        if (allowOverflow || (
            (!normalizedStartDate || day.date >= normalizedStartDate) && 
                (!normalizedEndDate || day.date <= normalizedEndDate)
        )) {
            acc[acc.length - 1].push(day)
        }

        return acc
    }, [] as Array<Array<{ date: Date }>>)
}

export function getCalendar(
    { colors, data, emptyColor, endDate, startDate, view }: GetCalendarProps
): Array<{ color: string; date: Date; value: number }> {
    const normalizedStartDate = startDate ? normalizeDate(startDate) : new Date()
    const normalizedEndDate = endDate ? normalizeDate(endDate) : new Date()

    let start: Date, end: Date

    if (view === 'monthly') {
        start = getMonthStart(normalizedStartDate)
        end = getMonthEnd(normalizedEndDate)
    } else {
        start = getWeekStart(normalizedStartDate)
        end = getWeekEnd(normalizedEndDate)
    }

    const startDayOfMonth = start.getDate()
    const totalDays = Math.floor((end.getTime() - start.getTime()) / 86400000) + 1

    let max = 0

    const days = new Array(totalDays).fill(null).map((_, offset) => {
        const day = getDay({ data, offset, startDate: start, startDayOfMonth })
        if (day.value > max) max = day.value
        
        return day
    })

    return days.map(({ date, value }) => {
        const color = getColor({ colors, max, value }) || emptyColor
        return { color, date, value }
    })
}

export function getColor({ colors, max, value }: GetColorOptions): string | null {
    if (colors.length === 0 || value === 0) return null

    const intensity = value / max

    for (let i = 1; i < colors.length; i++) {
        if (intensity < i / colors.length) {
            return colors[i - 1]
        }
    }

    return colors[colors.length - 1]
}

export function getDay({ data, offset, startDate, startDayOfMonth }: GetDayOptions): { date: Date; value: number } {
    const date = new Date(startDate)
    date.setDate(startDayOfMonth + offset)

    let value = 0
    const isoDate = normalizeDateToISO(date)

    if (data.has(isoDate)) {
        value = data.get(isoDate) || 0
    }

    return { date, value }
}
