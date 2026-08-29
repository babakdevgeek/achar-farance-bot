import { fetchJson } from "./http.js";
import { parsePrice, isWithinBounds, PRICE_BOUNDS, tehranTime } from "./validate.js";
import { getEndpoint } from "./config.js";

/**
 * Tabdeal web-app market API (no auth):
 *   GET https://api-web.tabdeal.org/r/plots/currencies/dynamic-info/
 * One JSON payload with every market, keyed as currencies[BASE][QUOTE]:
 *   { price, high_24, low_24, change_percent_24 }
 *
 * Verified to work when called from a deployed Cloudflare Worker (no special
 * headers needed — the earlier belief that it is only reachable from inside
 * Iran is wrong; the real deployment blocker was an unsupported fetch option,
 * see http.js).
 *
 * Used quotes (all in IRT = Toman):
 *   USDT -> free-market USD proxy
 *   BTC  -> Bitcoin
 *   GOLD -> 18-karat gold per gram (verified: = PAXG oz / 31.1 * 0.75)
 * Gold 24k is derived as gold18 / 0.75 purity.
 */
export const TABDEAL_CURRENCIES = {
    usd: "USDT",
    bitcoin: "BTC",
    gold18: "GOLD",
};

const TABDEAL_SOURCES = {
    usd: "tabdeal.org (USDT/IRT)",
    bitcoin: "tabdeal.org (BTC/IRT)",
    gold: "tabdeal.org (GOLD/IRT)",
};

/** 18k gold is 750/1000 pure; 24k is pure gold. */
const GOLD_18K_PURITY = 0.75;

// The endpoint returns ~125KB for ALL markets; share one response across the
// three price fetchers with a short memo to avoid triple-fetching per refresh.
const MEMO_TTL_MS = 10_000;
let memo = { at: 0, data: null };

async function fetchDynamicInfo() {
    if (memo.data && Date.now() - memo.at < MEMO_TTL_MS) return memo.data;

    const data = await fetchJson(getEndpoint("tabdealUrl"), { timeoutMs: 30_000, retries: 2 });
    if (!data || typeof data !== "object" || !data.currencies) {
        throw new Error("tabdeal: unexpected dynamic-info response");
    }

    memo = { at: Date.now(), data };
    return data;
}

function quoteFor(data, key) {
    const currency = TABDEAL_CURRENCIES[key];
    const quote = data?.currencies?.[currency]?.IRT;
    if (!quote || quote.price == null) {
        throw new Error(`tabdeal: missing "${currency}/IRT" quote`);
    }
    return quote;
}

/**
 * Price in Toman from the Tabdeal dynamic-info payload.
 * @param {"usd"|"bitcoin"|"gold18"|"gold24"} key which price to extract
 */
export async function fetchTabdealPrice(key) {
    const data = await fetchDynamicInfo();
    const sourceKey = key === "gold24" ? "gold18" : key;
    const quote = quoteFor(data, sourceKey);

    const price = parsePrice(quote.price);
    if (price == null || price <= 0) {
        throw new Error(`tabdeal: invalid price for "${TABDEAL_CURRENCIES[sourceKey]}/IRT": ${quote.price}`);
    }

    let value;
    if (key === "gold24") {
        value = price / GOLD_18K_PURITY; // derive pure-gold gram from the 18k token
    } else {
        value = price;
    }

    if (!isWithinBounds(value, PRICE_BOUNDS[key])) {
        throw new Error(`tabdeal: ${key} out of expected range: ${value}`);
    }

    const changePct = quote.change_percent_24 != null ? parseFloat(quote.change_percent_24) : null;

    return {
        value,
        changePct: Number.isFinite(changePct) ? changePct : null,
        unit: key.startsWith("gold") ? "تومان / گرم" : "تومان",
        source: key === "gold24" ? `${TABDEAL_SOURCES.gold} (محاسبه‌شده)` : TABDEAL_SOURCES[sourceKey === "gold18" ? "gold" : sourceKey],
        sourceTime: null,
        updatedAt: tehranTime(),
    };
}
