import { webhookCallback } from "grammy";
import { initBot } from "./init-bot.js";

import express from "express";

const bot = initBot();
const app = express();

app.use(express.json())

const PORT = process.env.PORT || 3000;

app.use("/webhook", webhookCallback(bot, "express"))

app.listen(PORT, () => console.log("Production server running on port " + PORT))