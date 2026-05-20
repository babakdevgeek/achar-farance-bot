import { Bot } from "grammy";

const bot = new Bot(process.env.BOT_TOKEN);


bot.command("start", (ctx) => {
    ctx.reply(`
            به ربات آچار فرانسه خوش آمدید

            فعلا تنها بخش تاریخ فعال است
            `)
})

console.log("working");



export default bot;