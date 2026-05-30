

export class CalculatorModel {
    constructor() {
        this.mathematicalRegex = /^[0-9+\-*/().\s×÷]+$/;
    }

    static validate(query) {
        return this.mathematicalRegex.test(query);
    }

    static calculate(query) {
        if (!this.validate(query)) return null;
        try {
            const cleanQuery = query.replace(/×/g, "*").replace(/÷/g, "/");

            const result = new Function(`return ${cleanQuery}`)();

            if (result !== undefined && !isNaN(result) && isFinite(result)) {
                return result;
            }
            return null;
        } catch (error) {
            return null;
        }
    }
}