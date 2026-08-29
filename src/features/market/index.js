import { InlineKeyboard } from "grammy";
import { renderOrEdit } from "../../shared/render.js";
import { parse_mode } from "../../shared/constants.js";
import { getMarketPrices } from "../../services/market/index.js";
import { marketText, marketKeyboard } from "./view.js";

const LOADING_TEXT = "⏳ در حال دریافت قیمت‌ها...";

async function showPrices(ctx) {
    const keyboard = marketKeyboard();
    try {
        const prices = await getMarketPrices();
        await renderOrEdit(ctx, marketText(prices), keyboard);
    } catch (error) {
        // Defensive: getMarketPrices never throws, but never let a handler crash the bot.
        console.error("[market] unexpected handler error:", error.message);
        await renderOrEdit(ctx, "❌ خطا در دریافت قیمت‌ها. لطفاً کمی بعد دوباره تلاش کنید.", keyboard);
    }
}

/** Handles /prices and the "market_prices" home-menu button. */
export function registerMarket(bot) {
    bot.command("prices", async (ctx) => {
        const loading = await ctx.reply(LOADING_TEXT);
        const prices = await getMarketPrices();
        await ctx.api.editMessageText(
            ctx.chat.id,
            loading.message_id,
            marketText(prices),
            { parse_mode, reply_markup: marketKeyboard() },
        );
    });

    bot.callbackQuery("market_prices", async (ctx) => {
        // Keep the back-to-home keyboard during loading; the final edit below
        // only replaces the text (same keyboard), so buttons never disappear.
        await renderOrEdit(ctx, LOADING_TEXT, marketKeyboard());
        await showPrices(ctx);
    });
}

