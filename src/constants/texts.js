import { Emoji } from "./emojies.js"

// start message with custome hello emojie at the first line

export class Text {

    static getText(name) {
        switch (name) {
            case "start":
                return `
 به ربات آچار فرانسه خوش آمدید <tg-emoji emoji-id="${Emoji
                        .getEmojiId("hello")}">${Emoji.getEmoji("hello")}</tg-emoji>
ابزار های موجود رو میتونید از منوی پایین استفاده
 کنید<tg-emoji emoji-id="${Emoji.getEmojiId("down")}">${Emoji.getEmoji("down")}</tg-emoji>
`
            default:
                return undefined;
        }
    }

}
