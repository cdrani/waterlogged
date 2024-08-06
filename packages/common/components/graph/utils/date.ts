export const getMonthEnd = (date: Date): Date => new Date(date.getFullYear(), date.getMonth() + 1, 0)

export const getMonthStart = (date: Date): Date => new Date(date.getFullYear(), date.getMonth(), 1)

export const getWeekEnd = (date: Date): Date => (
    new Date(date.getFullYear(), date.getMonth(), date.getDate() + (6 - date.getDay()))
)

export const getWeekIndex = (date: Date): number => {
    const firstWeekday = new Date(date.getFullYear(), date.getMonth(), 1).getDay()
    const offsetDate = date.getDate() + firstWeekday - 1

    return Math.floor(offsetDate / 7)
}

export const getWeekStart = (date: Date): Date  => (
    new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay())
)

export const normalizeDateToISO = (date: Date): string => date.toISOString().split('T')[0]

export const normalizeDate = (value: Date | number | string): Date => {
    if (value instanceof Date) return value

    if (typeof value == 'string') {
        let d = value.split('-')

        if (d[1].startsWith('0')) d[1] = d[1].slice(1)
        if (d[2].startsWith('0')) d[2] = d[2].slice(1)

        return new Date(d.join('-'))
    }

    throw new Error('Invalid date value')
}

export const stringifyDate = (date: Date): string  => (
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
)
