import "dotenv/config"

import bot from "./bot.js";
bot.command("start", (ctx) => {
    ctx.reply("به ربات آچار فرانسه خوش آمدید")
})
await bot.start({
    onStart() {
        console.log("bot started");

    }
})