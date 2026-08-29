import { parse_mode } from "./constants.js";

/**
 * Reply to a normal message, or edit the existing message when the update
 * came from an inline-keyboard callback.
 */
export async function renderOrEdit(ctx, text, keyboard) {
    const opts = { parse_mode, reply_markup: keyboard };
    if (ctx.callbackQuery) {
        await ctx.editMessageText(text, opts);
    } else {
        await ctx.reply(text, opts);
    }
}
