import bot from "../../src/bot.js";

/** @type {import("@netlify/functions").Handler} */
export async function handler(event) {
    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            body: "Method not allowed"
        }
    }
    try {
        const update = JSON.parse(event.body)
        await bot.handleUpdate(update)
        return {
            statusCode: 200,
            body: "OK"
        }
    } catch (error) {
        console.error("خطایی رخ داد", error)
        return {
            statusCode: 500,
            body: error
        }
    }
}
