// Production entrypoint: Cloudflare Worker webhook (see wrangler.json)
import { webhookCallback } from "grammy";
import { initBot } from "../bot.js";

export default {
    fetch: (request, env, ctx) => {
        const bot = initBot(env);
        return webhookCallback(bot, "cloudflare-mod")(request, env, ctx);
    },
};
