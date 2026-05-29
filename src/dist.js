import { webhookCallback } from "grammy";
import { initBot } from "./init-bot.js";


export default {
    fetch: (request, env, ctx) => {
        console.log("🔥 HIT WORKER");
        const bot = initBot(env);

        return webhookCallback(bot, "cloudflare-mod")(
            request,
            env,
            ctx
        );
    },
};
