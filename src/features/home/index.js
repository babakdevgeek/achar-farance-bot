import { renderOrEdit } from "../../shared/render.js";
import { homeText, homeKeyboard } from "./view.js";

/** Handles /start and the "home" callback button. */
export function registerHome(bot) {
    const handler = (ctx) => renderOrEdit(ctx, homeText(), homeKeyboard());

    bot.command("start", handler);
    bot.callbackQuery("home", handler);
}
