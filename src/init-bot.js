import { Bot } from "grammy";
import { HomeController } from "./controller/home-controller.js";
import { DateTimeController } from "./controller/date-time-controller.js";
import { CalculatorController } from "./controller/calculator-controller.js";


export function initBot(env) {
    const token = env?.BOT_TOKEN || process.env.BOT_TOKEN;
    console.log("TOKEN EXISTS:", !!token);
    if (!token) {
        throw new Error("BOT_TOKEN is not defined in environment variables.");
    }
    const bot = new Bot(token);

    bot.command("start", async (ctx) => {
        await HomeController.render(ctx);
    })

    bot.callbackQuery("current_time", async (ctx) => {
        await DateTimeController.render(ctx);
    })

    bot.callbackQuery("home", async (ctx) => {
        await HomeController.render(ctx);
    })

    bot.on("inline_query", async (ctx) => {
        await CalculatorController.calculator(ctx);
    })


    return bot;
}


