import { CALC_ERRORS, calculate } from "./calculator.js";
import { calculatorSuccessArticle, calculatorErrorArticle } from "./view.js";

/** Telegram caches identical inline results; avoid re-evaluating repeat queries. */
const CACHE_SECONDS = 300;

/** Handles inline queries (type "@botname 2+2" in any chat). */
export function registerCalculator(bot) {
    bot.on("inline_query", async (ctx) => {
        const result = calculate(ctx.inlineQuery.query);

        try {
            if (!result.ok) {
                return await ctx.answerInlineQuery(calculatorErrorArticle(result.error, CALC_ERRORS), {
                    cache_time: CACHE_SECONDS,
                });
            }
            return await ctx.answerInlineQuery(calculatorSuccessArticle(result.expression, result.formatted), {
                cache_time: CACHE_SECONDS,
            });
        } catch (err) {
            // Answering inline queries can fail (e.g. query too old) — never crash the bot.
            console.error("inline_query answer failed:", err);
        }
    });
}
