import { Bot } from "grammy";
import { setCommands } from "./commands.js";

const bot = new Bot(process.env.BOT_TOKEN);


setCommands(bot);
console.log("check for handle update", bot.handleUpdate);


export default bot;