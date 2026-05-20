import bot from "../src/bot";

/** @type {import("@netlify/functions").Handler} */
export function handler(event) {
    if (event.httpMethod === "POST") {
        try {
            const update = JSON.parse(event.body)
            await bot.handleUpdate(update)
        } catch (error) {
            console.error("خطایی رخ داد", error)
        }
    }
}
