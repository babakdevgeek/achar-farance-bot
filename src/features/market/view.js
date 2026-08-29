import { InlineKeyboard } from "grammy";
import { emojiTag } from "../../shared/emojis.js";

const NUMBER_FMT = new Intl.NumberFormat("en-US");

function formatNumber(value) {
    return NUMBER_FMT.format(Math.round(value));
}

const STALE_WARNING = "⚠️ آخرین مقدار موجود (منبع فعلاً در دسترس نیست)";

/** Trend arrow + percent, e.g. "🔺 0.42%" / "🔻 1.10%" — hidden when unknown. */
function trend(changePct) {
    if (typeof changePct !== "number" || !Number.isFinite(changePct) || Math.abs(changePct) < 0.005) {
        return "➖";
    }
    return changePct > 0 ? `🔺 ${changePct.toFixed(2)}%` : `🔻 ${Math.abs(changePct).toFixed(2)}%`;
}

/**
 * One price "row" as a pre block. <pre> is a true monospace block and
 * preserves spaces exactly, so padding numbers to equal width renders a
 * clean aligned table in every Telegram client (unlike inline <code>).
 */
function card(icon, title, price, unit, { showTrend = true } = {}) {
    if (!price) return "";
    const change = showTrend ? `  ${trend(price.changePct)}` : "";
    const value = formatNumber(price.value).padEnd(16);
    return `${icon} <b>${title}</b>\n<pre>${value}${unit.padEnd(10)}${change.trim()}</pre>`;
}

const USD_UNIT = "تومان";
const GOLD_UNIT = "تومان/گرم";

const DIVIDER = "\n➖➖➖➖➖➖➖➖➖➖\n";

function usdSection(usd) {
    if (!usd.ok) return "💵 <b>دلار:</b> ❌ دریافت نشد";
    return card("💵", "دلار آمریکا", usd.data, USD_UNIT) + (usd.stale ? `\n${STALE_WARNING}` : "");
}

function goldSection(gold) {
    if (!gold.ok) return "🥇 <b>طلا:</b> ❌ دریافت نشد";
    const body =
        card("🥇", "طلای ۱۸ عیار", gold.data.gold18, GOLD_UNIT) + "\n" +
        card("🥈", "طلای ۲۴ عیار", gold.data.gold24, GOLD_UNIT) + "\n" +
        card("🪙", "سکه امامی", gold.data.emamiCoin, USD_UNIT);
    return body + (gold.stale ? `\n${STALE_WARNING}` : "");
}

function bitcoinSection(bitcoin) {
    if (!bitcoin.ok) return "₿ <b>بیت‌کوین:</b> ❌ دریافت نشد";
    return card("₿", "بیت‌کوین", bitcoin.data, USD_UNIT) + (bitcoin.stale ? `\n${STALE_WARNING}` : "");
}

/** All currently-successful source names, for the "Sources:" footer. */
function sourcesLine(prices) {
    const names = new Set();
    for (const p of [prices.usd, prices.gold, prices.bitcoin]) {
        if (p.ok) names.add(p.data.source);
    }
    return names.size ? [...names].join("، ") : "هیچ منبعی در دسترس نبود";
}

export function marketText(prices) {
    const updated = prices.fetchedAt.toLocaleTimeString("en-GB", {
        timeZone: "Asia/Tehran",
        hour: "2-digit",
        minute: "2-digit",
    });

    return `
<b>📊 قیمت لحظه‌ای بازار</b>
${DIVIDER}
${usdSection(prices.usd)}

${goldSection(prices.gold)}

${bitcoinSection(prices.bitcoin)}
${DIVIDER}
<i>${emojiTag("watch")} به‌روزرسانی: ${updated}</i>
<blockquote expandable>📊 منابع: ${sourcesLine(prices)}
⚠️ قیمت‌ها تنها جهت اطلاع است و ممکن است با بازار لحظه‌ای تفاوت داشته باشد.</blockquote>
`;
}

export function marketKeyboard() {
    return new InlineKeyboard()
        .text("🔄 به‌روزرسانی", "market_prices")
        .text("🏠 منوی اصلی", "home");
}

