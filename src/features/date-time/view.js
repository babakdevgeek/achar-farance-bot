import { InlineKeyboard } from "grammy";
import { emojiTag } from "../../shared/emojis.js";
import { parse_mode } from "../../shared/constants.js";
import { getDateInfo } from "./date.js";

export function dateTimeText() {
    const d = getDateInfo(); // compute once, not per-line

    return `
<i><b>ساعت</b></i> ${emojiTag("watch")}:                                                     <code>${d.time}</code>

<b>امروز</b>

<i><b>شاهنشاهی</b></i> ${emojiTag("cyrus")}:                                        <code>${d.imperial}</code>

<i><b>میلادی</b></i> ${emojiTag("jesus")}:                                              <code>${d.gregorian}</code>

<i><b>شمسی</b></i> ${emojiTag("islam")}:                                              <code>${d.jalali}</code>

                            <b>${d.dayPersian} / ${d.dayEnglish}</b>
`;
}

export function dateTimeKeyboard() {
    return new InlineKeyboard().text("بازگشت به منوی اصلی", "home");
}

export const dateTimeParseMode = parse_mode;
