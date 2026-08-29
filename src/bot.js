import { Bot } from "grammy";
import { registerHome } from "./features/home/index.js";
import { registerDateTime } from "./features/date-time/index.js";
import { registerCalculator } from "./features/calculator/index.js";

/**
 * Create the bot and register all features.
 * To add a feature: create src/features/<name>/index.js exporting
 * registerXxx(bot), then call it here.
 */
export function initBot(env) {
    const token = env?.BOT_TOKEN || process.env.BOT_TOKEN;
    if (!token) {
        throw new Error("BOT_TOKEN is not defined in environment variables.");
    }

    const bot = new Bot(token);

    registerHome(bot);       // /start, "home" callback
    registerDateTime(bot);   // "current_time" callback
    registerCalculator(bot); // inline queries

    return bot;
}
