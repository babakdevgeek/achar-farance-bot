import { fetchJson } from "./http.js";
import { parsePrice } from "./validate.js";

/**
 * TGJU (tgju.org) public JSON feed — the most widely used price reference in Iran.
 * One request contains all quotes (USD, gold, coins, crypto) in RIAL.
 * A snapshot is shared between the USD and gold sources to avoid duplicate requests.
 */
const TGJU_URL = "https://call1.tgju.org/ajax.json";

/** Items we care about, keyed by TGJU's quote id. */
export const TGJU_ITEMS = {
    usd: "price_dollar_rl", // USD free-market rate (Rial)
    gold18: "geram18", // 18-karat gold per gram (Rial)
    gold24: "geram24", // 24-karat gold per gram (Rial)
    emamiCoin: "sekee", // Emami coin (Rial)
    goldOunce: "ons", // global gold ounce (USD)
};

/** Convert Persian digits in TGJU's time strings ("۱۱:۰۰:۱۱") to latin. */
function normalizeDigits(str) {
    return String(str).replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d));
}

/**
 * Fetch a validated TGJU quote.
 * @param {string} itemKey one of TGJU_ITEMS keys
 * @returns {Promise<{ valueRial: number, quoteTime: string }>}
 * @throws {Error} when the item is missing, malformed or out of the expected range
 */
export async function fetchTgjuQuote(itemKey) {
    const itemId = TGJU_ITEMS[itemKey];
    if (!itemId) throw new Error(`unknown TGJU item: ${itemKey}`);

    const data = await fetchJson(TGJU_URL, { timeoutMs: 10_000 });
    const quote = data?.current?.[itemId];
    if (!quote || quote.p == null) {
        throw new Error(`TGJU response missing "${itemId}"`);
    }

    const valueRial = parsePrice(quote.p);
    if (valueRial == null || valueRial <= 0) {
        throw new Error(`TGJU "${itemId}" has invalid price: ${quote.p}`);
    }

    // "d" is the absolute daily change (Rial). Derive a signed percentage.
    let changePct = null;
    const diffRial = parsePrice(quote.d);
    if (diffRial != null && valueRial - diffRial !== 0) {
        changePct = (diffRial / (valueRial - diffRial)) * 100;
    }

    return { valueRial, changePct, quoteTime: normalizeDigits(quote.t || "") };
}
