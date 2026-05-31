import moment from "moment-jalaali";

export class DateModel {
    static getDate() {
        const nowForTime = new Date().toLocaleString("fa-IR", { timeZone: "Asia/Tehran" });
        const now = new Date().toLocaleString("en-us", { timeZone: "Asia/Tehran" });
        moment.loadPersian({ dialect: "persian-modern", usePersianDigits: true });
        return {
            dayPersian: moment(now).locale("fa").format("dddd"),
            dayEnglish: moment(now).locale("en").format("dddd"),
            time: moment(nowForTime).format("HH:mm:ss"),
            georgian: moment(now).format("YYYY/MM/DD"),
            jalali: moment(now).format("jYYYY/jMM/jDD"),
            imperial: moment(now).add(1180, "years").format("jYYYY/jMM/jDD")
        }
    }

}