import { fetchJson } from "./http.js";
import { parsePrice, rialToToman } from "./validate.js";
import { getEndpoint } from "./config.js";

/**
 * TGJU (tgju.org) public JSON feed — primary market source.
 * One request contains all quotes in RIAL: USD, gold, coins, crypto.
 * A snapshot is shared between the USD/gold/bitcoin sources.
 * Fallback: Tabdeal's web API, which is also verified to work when
 * deployed as a Cloudflare Worker (see tabdeal.js).
 */
export const TGJU_ITEMS = {
    usd: "price_dollar_rl", // USD free-market rate (Rial)
    gold18: "geram18", // 18-karat gold per gram (Rial)
    gold24: "geram24", // 24-karat gold per gram (Rial)
    emamiCoin: "sekee", // Emami coin (Rial)
    bitcoin: "crypto-bitcoin", // BTC in USD (!) — converted via the USD rate
};

/** Convert Persian digits in TGJU's time strings ("۱۱:۰۰:۱۱") to latin. */
function normalizeDigits(str) {
    return String(str).replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d));
}

// Share one snapshot (~145KB) across all quote fetchers for a few seconds.
const MEMO_TTL_MS = 10_000;
let memo = { at: 0, data: null };

async function fetchSnapshot() {
    if (memo.data && Date.now() - memo.at < MEMO_TTL_MS) return memo.data;

    const data = await fetchJson(getEndpoint("tgjuUrl"), { timeoutMs: 20_000, retries: 2 });
    if (!data?.current) throw new Error("tgju: unexpected response (missing current)");

    memo = { at: Date.now(), data };
    return data;
}

/**
 * Fetch a validated TGJU quote, converted to TOMAN.
 * @param {string} itemKey one of TGJU_ITEMS keys
 * @returns {Promise<{ valueToman: number, changePct: number|null, quoteTime: string, isUsdQuote?: boolean }>}
 * @throws {Error} when the item is missing, malformed or not a usable number
 */
export async function fetchTgjuQuote(itemKey) {
    const itemId = TGJU_ITEMS[itemKey];
    if (!itemId) throw new Error(`unknown TGJU item: ${itemKey}`);

    const snapshot = await fetchSnapshot();
    const quote = snapshot.current[itemId];
    if (!quote || quote.p == null) {
        throw new Error(`tgju: response missing "${itemId}"`);
    }

    const price = parsePrice(quote.p);
    if (price == null || price <= 0) {
        throw new Error(`tgju: "${itemId}" has invalid price: ${quote.p}`);
    }

    // "d" is the absolute daily change (same unit as p). Derive a signed percentage.
    let changePct = null;
    const diff = parsePrice(quote.d);
    if (diff != null && price - diff !== 0) {
        changePct = (diff / (price - diff)) * 100;
    }

    const isUsdQuote = itemKey === "bitcoin"; // crypto-bitcoin is quoted in USD

    return {
        valueToman: isUsdQuote ? price : rialToToman(price),
        changePct,
        quoteTime: normalizeDigits(quote.t || ""),
        isUsdQuote,
    };
}
