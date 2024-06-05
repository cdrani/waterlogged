export function getWeekDay(c: Date) {
    let daysList = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ];
    return daysList[c.getDay()];
}

export function getMonth(c: Date) {
    let monthsList = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];
    return monthsList[c.getMonth()];
}

export function getDate(c: Date) {
    return c.getDate();
}

export function getHour(c: Date) {
    return c.getHours() % 12 || 12;
}

export function getMinute(c: Date) {
    return c.getMinutes() < 10 ? "0" + c.getMinutes() : c.getMinutes();
}

export function getMeridiem(c: Date) {
    return c.getHours() < 12 ? "AM" : "PM";
}
