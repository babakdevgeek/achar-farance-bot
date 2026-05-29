import { Bot } from "grammy";
import "dotenv/config"
import { HomeController } from "./controller/home-controller.js";
import { DateTimeController } from "./controller/date-time-controller.js";


export function initBot() {
    const bot = new Bot(process.env.BOT_TOKEN);

    bot.command("start", async (ctx) => {
        await HomeController.render(ctx);
    })

    bot.callbackQuery("current_time", async (ctx) => {
        await DateTimeController.render(ctx);
    })

    bot.callbackQuery("home", async (ctx) => {
        await HomeController.render(ctx);
    })


    return bot;
}


