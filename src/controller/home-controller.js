import { HomeView } from "../view/home-view.js";

export class HomeController {
    static async render(ctx) {
        if (ctx.callbackQuery) {
            await ctx.editMessageText(HomeView.text(), { parse_mode: "HTML", reply_markup: HomeView.keyboard() })
        } else {
            await ctx.reply(HomeView.text(), { parse_mode: "HTML", reply_markup: HomeView.keyboard() })
        }
    }
}