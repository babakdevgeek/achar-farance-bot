import { Bot } from "grammy";

/** =========================
 *  BOT INIT (SINGLE SOURCE)
 *  ========================= */
const bot = new Bot(process.env.BOT_TOKEN);

// commands
bot.command("start", (ctx) => {
    ctx.reply(`
👋 به ربات آچار فرانسه خوش آمدید

📅 فعلاً فقط بخش تاریخ فعال است
    `);
});

bot.command("date", (ctx) => {
    const now = new Date();

    const gregorian = now.toLocaleDateString("en-US");
    const time = now.toLocaleTimeString("fa-IR");

    ctx.reply(
        `📅 میلادی: ${gregorian}
🕒 ساعت: ${time}`
    );
});

/** =========================
 *  NETLIFY HANDLER
 *  ========================= */
export const handler = async (event) => {

    try {
        console.log("🔥 update received");

        if (event.httpMethod !== "POST") {
            return {
                statusCode: 200,
                body: "OK (ignored non-POST)",
            };
        }

        if (!event.body) {
            return {
                statusCode: 200,
                body: "OK (empty body)",
            };
        }

        const update = JSON.parse(event.body);

        console.log("📦 update:", update?.update_id);
        await bot.init()

        // IMPORTANT: this must exist
        if (!bot.handleUpdate) {
            throw new Error("Bot not initialized correctly");
        }

        await bot.handleUpdate(update);

        return {
            statusCode: 200,
            body: "OK",
        };

    } catch (err) {
        console.error("❌ ERROR:", err);

        // NEVER break Telegram webhook
        return {
            statusCode: 200,
            body: "error handled",
        };
    }
};