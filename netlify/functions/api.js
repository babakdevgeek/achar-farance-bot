import bot from "./parts/bot.js";

let initialized = false;
/** @type {import("@netlify/functions").Handler} */
export async function handler(event) {

    try {
        if (event.httpMethod !== "POST") {
            return {
                statusCode: 405,
                body: "Method not allowed",
            };
        }

        const update = JSON.parse(event.body || "{}");
        await bot.init();

        console.log("🔥 update received");
        console.log("handle update in api", bot.handleUpdate)
        if (!bot?.handleUpdate) {
            throw new Error("Bot is not initialized correctly");
        }

        await bot.handleUpdate(update);

        return {
            statusCode: 200,
            body: "OK",
        };

    } catch (error) {

        console.error("🔥 ERROR:", error);

        return {
            statusCode: 200, // IMPORTANT for Telegram
            body: "error handled",
        };
    }
}