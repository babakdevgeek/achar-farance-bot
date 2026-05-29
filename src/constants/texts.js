import { Emoji } from "./emojies.js"

// start message with custome hello emojie at the first line

export class Text {

    static getText(name) {
        switch (name) {
            case "start":
                return `
 درود خوش آمدید <tg-emoji emoji-id="${Emoji
                        .getEmojiId("hello")}">${Emoji.getEmoji("hello")}</tg-emoji>


<blockquote>Of all things, i liked books best.</blockquote>
<i> - NICOLA TESLA </i>${Emoji.getEmojTag("tesla")}${Emoji.getEmojTag("light-heart")} 

منوی ابزار ${Emoji.getEmojTag("down")}
`
            default:
                return undefined;
        }
    }

}
