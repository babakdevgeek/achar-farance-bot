import { InlineKeyboard } from "grammy";
import { emoji } from "../../shared/emojis.js";
import { WELCOME_TEXT } from "./texts.js";

export function homeText() {
    return WELCOME_TEXT;
}

export function homeKeyboard() {
    return new InlineKeyboard()
        .text(`تاریخ و زمان فعلی ${emoji("calendar")}`, "current_time")
        .row()
        .switchInlineCurrent(`ماشین حساب ${emoji("calculator")}`)
        .row()
        .url("ارزهای دیجیتال", "https://vanila-js-crypto-dashboard.bobandcomputers.workers.dev")
        .url("دانلود فیلم و سریال", "https://fastmovie.bobandcomputers.workers.dev/");
}
