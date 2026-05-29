import moment from "moment-jalaali";

export class DateModel {
    static getDate() {
        const now = new Date();
        moment.loadPersian({ dialect: "persian-modern", usePersianDigits: true });
        return {
            time: moment(now).format("HH:mm:ss"),
            georgian: moment(now).format("YYYY/MM/DD"),
            jalali: moment(now).format("jYYYY/jMM/jDD"),
            imperial: moment(now).add(1180, "years").format("jYYYY/jMM/jDD")
        }
    }

}