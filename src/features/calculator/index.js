import { CALC_ERRORS, calculate } from "./calculator.js";
import { calculatorSuccessArticle, calculatorErrorArticle } from "./view.js";

/** Handles inline queries (type "@botname 2+2" in any chat). */
export function registerCalculator(bot) {
    bot.on("inline_query", async (ctx) => {
        const result = calculate(ctx.inlineQuery.query);

        if (!result.ok) {
            return ctx.answerInlineQuery(calculatorErrorArticle(result.error, CALC_ERRORS));
        }
        return ctx.answerInlineQuery(calculatorSuccessArticle(result.expression, result.result));
    });
}
