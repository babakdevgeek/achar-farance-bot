import { evaluate } from "mathjs";


export class CalculatorModel {

    static ERROR = {
        EMPTY: "لطفا یک عبارت ریاضی وارد کنید.",
        INVALID: "عبارت ریاضی وارد شده معتبر نیست.",
        SYNTAX: "خطا در تجزیه عبارت ریاضی. لطفا مطمئن شوید که عبارت صحیح است.",
        NOT_FINITE: "نتیجه محاسبه نامتناهی یا غیرقابل محاسبه است.",
        NOT_NUMBER: "نتیجه محاسبه یک عدد نیست."
    }

    static normalize(input) {
        return input
            .replace(/×/g, "*")
            .replace(/÷/g, "/")
            .trim();
    }

    static calculate(input) {
        if (!input || !input.trim()) {
            return { ok: false, error: this.ERROR.EMPTY };
        }

        const expression = this.normalize(input);

        try {
            const result = evaluate(expression);

            if (typeof result !== "number") {
                return { ok: false, error: this.ERROR.NOT_NUMBER };
            }

            if (!Number.isFinite(result)) {
                return { ok: false, error: this.ERROR.NOT_FINITE };
            }

            return { ok: true, result, expression };
        } catch (error) {
            return { ok: false, error: this.ERROR.SYNTAX };
        }
    }
}