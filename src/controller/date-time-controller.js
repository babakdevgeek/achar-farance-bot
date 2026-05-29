import { DateTimeView } from "../view/date-time-view.js";

export class DateTimeController {
    static async render(ctx) {
        await ctx.editMessageText(DateTimeView.text(), { parse_mode: "HTML", reply_markup: DateTimeView.keyboard() })
    }
}