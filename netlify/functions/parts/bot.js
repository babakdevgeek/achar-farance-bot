import { Bot } from "grammy";

const bot = new Bot(process.env.BOT_TOKEN);


setCommands(bot);


export default bot;