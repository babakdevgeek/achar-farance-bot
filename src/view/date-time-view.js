import { InlineKeyboard } from "grammy";
import { DateModel } from "../model/date-model.js";
import { Emoji } from "../constants/emojies.js";

export class DateTimeView {
    static text() {
        return `

<i><b>ساعت</b></i> ${Emoji.getEmojTag("watch")}:                                                     <code>${DateModel.getDate().time}</code>

<b>تاریخ و زمان فعلی</b>

<i><b>شاهنشاهی</b></i> ${Emoji.getEmojTag("cyrus")}:                                        <code>${DateModel.getDate().imperial}</code>

<i><b>میلادی</b></i> ${Emoji.getEmojTag("jesus")}:                                              <code>${DateModel.getDate().georgian}</code>

<i><b>شمسی</b></i> ${Emoji.getEmojTag("islam")}:                                              <code>${DateModel.getDate().jalali}</code>

                            <b>${DateModel.getDate().dayPersian} / ${DateModel.getDate().dayEnglish}</b>

`
    }

    static keyboard() {
        const keyboard = new InlineKeyboard();
        keyboard.text("بازگشت به منوی اصلی", "home");
        return keyboard;
    }
}