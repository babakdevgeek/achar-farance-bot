import { Bot } from "grammy";
import { setCommands } from "./commands.js";

const bot = new Bot(process.env.BOT_TOKEN);

console.log("token is : ", process.env.BOT_TOKEN);

setCommands(bot);
console.log("code after set command run");


export default bot;