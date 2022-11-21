import { parseISO } from "date-fns";

const getDaysInMonth = (year, month) => {
    return new Date(Date.UTC(year, month, 0)).getDate();
};

const getWeekdayNumberMonIsOne = (date) => {
    const jsDay = date.getDay();
    return jsDay === 0 ? 7 : jsDay;
};

const getUTCFromDateAndLocalTimeString = (date, timeString) => {
    const day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    const month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
    const timeOffset = date.getTimezoneOffset() / -60;
    const offsetSign = timeOffset > 0 ? "+" : "-";
    const offsetString = timeOffset.toString().length < 2 ? "0" + timeOffset : timeOffset;
    const dateString =
        date.getYear() + 1900 + "-" + month + "-" + day + "T" + timeString + ".00" + offsetSign + offsetString;

    return parseISO(dateString);
};

export { getDaysInMonth, getWeekdayNumberMonIsOne, getUTCFromDateAndLocalTimeString };
