export const EMOJIS = {
    hello: { unicode: "👋", id: "5458904472598095631" },
    down: { unicode: "👇", id: "5447183459602669338" },
    calendar: { unicode: "📅", id: "5472279086657199080" },
    watch: { unicode: "⏰", id: "5201706180052808172" },
    jesus: { unicode: "✝️", id: "6337110540283810640" },
    islam: { unicode: "☪️", id: "5379715437552488829" },
    cyrus: { unicode: "👑", id: "5940804519083383006" },
    tesla: { unicode: "⚡", id: "5217777853185143415" },
    "light-heart": { unicode: "🤍", id: "6307312246162723113" },
    calculator: { unicode: "🧮", id: "5303214794336125778" },
};

/** Raw unicode emoji by name. */
export function emoji(name) {
    return EMOJIS[name]?.unicode;
}

/**
 * Custom Telegram emoji as an HTML <tg-emoji> tag (only works for bots
 * that own the custom emoji pack).
 */
export function emojiTag(name) {
    const e = EMOJIS[name];
    if (!e) return undefined;
    return `<tg-emoji emoji-id="${e.id}">${e.unicode}</tg-emoji>`;
}
