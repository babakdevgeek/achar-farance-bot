// Local development entrypoint: long polling via `npm run dev`
import "dotenv/config";
import { initBot } from "../bot.js";

initBot({ BOT_TOKEN: process.env.BOT_TOKEN }).start({
    onStart: () => console.log("Bot started successfully!"),
});
