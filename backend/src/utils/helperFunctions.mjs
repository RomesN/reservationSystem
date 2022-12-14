import { add, parseISO, roundToNearestMinutes } from "date-fns";
import crypto from "crypto";
import CoveredError from "./coveredError.mjs";

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
const sortIntervalList = (intervalList) => {
    return intervalList.sort((resA, resB) => {
        if (resA.startTime < resB.date) {
            return -1;
        } else {
            return 1;
        }
    });
};

const getUTCDate = (year, month, day) => {
    const yearAsNumber = parseInt(year);
    const monthAsNumber = parseInt(month);
    const dayAsNumber = parseInt(day);

    if (
        !Number.isInteger(yearAsNumber) ||
        !Number.isInteger(monthAsNumber) ||
        !Number.isInteger(dayAsNumber) ||
        monthAsNumber > 12
    ) {
        throw new CoveredError(400, "Input in wrong format.");
    }

    return new Date(Date.UTC(yearAsNumber, monthAsNumber - 1, dayAsNumber));
};

const generateCustomToken = (tokenLength) => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz01234567890123456789";
    let generatedToken = "";

    while (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(generatedToken)) {
        generatedToken = "";
        for (let i = 0; i < tokenLength; i++) {
            generatedToken += characters.charAt(crypto.randomInt(characters.length));
        }
    }
    return generatedToken;
};

const formatName = (name) => {
    const nameLower = name.toLowerCase();
    return (name[0].toUpperCase() + nameLower.substring(1)).trim();
};

const formatEmail = (email) => {
    return email.toLowerCase();
};

const formatPhone = (phone) => {
    return phone.replaceAll(" ", "");
};

const roundToNearestMinutesUp = (date) => {
    const incrementToRound = parseInt(process.env.BOOKING_EVERY_NEAREST_MINUTES || "15") / 2;
    return roundToNearestMinutes(
        add(date, {
            minutes: incrementToRound,
        }),
        {
            nearestTo: parseInt(process.env.BOOKING_EVERY_NEAREST_MINUTES || "15"),
        }
    );
};

export {
    formatEmail,
    formatName,
    formatPhone,
    generateCustomToken,
    getDaysInMonth,
    getUTCDate,
    getWeekdayNumberMonIsOne,
    getUTCFromDateAndLocalTimeString,
    roundToNearestMinutesUp,
    sortIntervalList,
};
