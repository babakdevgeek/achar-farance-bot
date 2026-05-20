import { Bot } from "grammy";
import { setCommands } from "./commands";

const bot = new Bot(process.env.BOT_TOKEN);

await bot.init()
setCommands(bot);


export default bot;