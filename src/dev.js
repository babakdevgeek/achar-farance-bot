import { initBot } from "./init-bot.js";

initBot().start({
    onStart: async (ctx) => {
        console.log("Bot started successfully!");
    }
})