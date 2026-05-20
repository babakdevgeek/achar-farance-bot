import { Bot } from "grammy";
import { setCommands } from "../../src/commands.js";

const bot = new Bot(process.env.BOT_TOKEN);

setCommands(bot);


export default bot;