import bot from "./bot"

/** 
 * @param {import("grammy").Bot} bot 
 * */
export const setCommands = function (bot) {
    bot.command("start", (ctx) => {
        ctx.reply(`
            به ربات آچار فرانسه خوش آمدید

            فعلا تنها بخش تاریخ فعال است
            `)
    })
} 