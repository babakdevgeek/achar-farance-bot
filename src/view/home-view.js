import { InlineKeyboard } from "grammy";
import { Emoji } from "../constants/emojies.js";
import { Text } from "../constants/texts.js";


export class HomeView {
    static text() {
        return Text.getText("start");
    }
    static keyboard() {
        const keyboard = new InlineKeyboard().text("تاریخ و زمان فعلی", "current_time").icon(Emoji.getEmojiId("calendar")).row()
            .switchInlineCurrent("ماشین حساب").icon(Emoji.getEmojiId("calculator"));
        return keyboard;
    }
}