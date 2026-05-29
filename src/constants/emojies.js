
export class Emoji {
    static getEmojiId(name) {
        switch (name) {
            case "hello":
                return "5458904472598095631";
            case "down":
                return "5447183459602669338";
            case "calendar":
                return "5472279086657199080";
            case "watch":
                return "5201706180052808172";
            case "jesus":
                return "6337110540283810640";
            case "islam":
                return "5379715437552488829";
            case "cyrus":
                return "5940804519083383006";
            default:
                return undefined;
        }
    }

    static getEmojTag(name) {
        switch (name) {
            case "hello":
                return `<tg-emoji emoji-id="${this.getEmojiId("hello")}">${this.getEmoji("hello")}</tg-emoji>`;
            case "down":
                return `<tg-emoji emoji-id="${this.getEmojiId("down")}">${this.getEmoji("down")}</tg-emoji>`;
            case "calendar":
                return `<tg-emoji emoji-id="${this.getEmojiId("calendar")}">${this.getEmoji("calendar")}</tg-emoji>`;
            case "watch":
                return `<tg-emoji emoji-id="${this.getEmojiId("watch")}">${this.getEmoji("watch")}</tg-emoji>`;
            case "jesus":
                return `<tg-emoji emoji-id="${this.getEmojiId("jesus")}">${this.getEmoji("jesus")}</tg-emoji>`;
            case "islam":
                return `<tg-emoji emoji-id="${this.getEmojiId("islam")}">${this.getEmoji("islam")}</tg-emoji>`;
            case "cyrus":
                return `<tg-emoji emoji-id="${this.getEmojiId("cyrus")}">${this.getEmoji("cyrus")}</tg-emoji>`;
            default:
                return undefined;
        }
    }

    static getEmoji(name) {
        switch (name) {
            case "hello":
                return "👋";
            case "down":
                return "👇";
            case "calendar":
                return "📅";
            case "watch":
                return "⏰";
            case "jesus":
                return "✝️";
            case "islam":
                return "☪️";
            case "cyrus":
                return "👑";
            default:
                return undefined;
        }
    }
}
