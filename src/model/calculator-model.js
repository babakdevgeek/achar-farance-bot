import { evaluate } from "mathjs";


export class CalculatorModel {

    static ERROR = {
        EMPTY: "EMPTY",
        INVALID: "INVALID",
        SYNTAX: "SYNTAX",
        NOT_FINITE: "NOT_FINITE",
        NOT_NUMBER: "NOT_NUMBER"
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