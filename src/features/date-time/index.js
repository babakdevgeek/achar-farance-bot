import { renderOrEdit } from "../../shared/render.js";
import { dateTimeText, dateTimeKeyboard } from "./view.js";

/** Handles the "current_time" callback button. */
export function registerDateTime(bot) {
    bot.callbackQuery("current_time", async (ctx) => {
        await renderOrEdit(ctx, dateTimeText(), dateTimeKeyboard());
    });
}
