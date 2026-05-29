import { initBot } from "./init-bot.js";
import "dotenv/config"

initBot({ BOT_TOKEN: process.env.BOT_TOKEN }).start({
    onStart: async (ctx) => {
        console.log("Bot started successfully!");
    }
})