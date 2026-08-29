import moment from "moment-jalaali";

const TEHRAN_TZ = "Asia/Tehran";

/**
 * Current date/time info: Persian & English weekday, clock time,
 * Gregorian date, Jalali (Solar Hijri) date and "Imperial" date
 * (Jalali + 1180 years, a playful historical convention).
 */
export function getDateInfo() {
    // Parse the Tehran-localized time into a real Date so moment receives
    // a Date object (avoids the locale-string deprecation warning).
    const now = new Date(new Date().toLocaleString("en-us", { timeZone: TEHRAN_TZ }));
    moment.loadPersian({ dialect: "persian-modern", usePersianDigits: true });

    return {
        time: moment(now).format("HH:mm:ss"),
        dayPersian: moment(now).locale("fa").format("dddd"),
        dayEnglish: moment(now).locale("en").format("dddd"),
        gregorian: moment(now).format("YYYY/MM/DD"),
        jalali: moment(now).format("jYYYY/jMM/jDD"),
        imperial: moment(now).add(1180, "years").format("jYYYY/jMM/jDD"),
    };
}
