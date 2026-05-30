import { CalculatorModel } from "../model/calculator-model.js";
import { CalculatorView } from "../view/calculator-view.js";

export class CalculatorController {

    static async calculator(ctx) {
        const query = ctx.inlineQuery.query;

        const result = CalculatorModel.calculate(query);
        if (!result.ok) {
            return ctx.answerInlineQuery(CalculatorView.error(result.error));
        }

        return ctx.answerInlineQuery(CalculatorView.success(result.expression, result.result));
    }
}