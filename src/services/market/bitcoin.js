import { fetchTextSafe } from "./http.js";
import { parsePrice, isWithinBounds, PRICE_BOUNDS, tehranTime } from "./validate.js";
import { getEndpoint } from "./config.js";

/**
 * Bitcoin price in Toman from ramzarz.news/coins/bitcoin.
 * Server-rendered page with stable data attributes:
 *   data-price-toman="15795509472.401"  -> price in TOMAN
 *   <div class="arrow arrow-down"> ... 2.39% (1D)  -> 24h change (direction from arrow class)
 * URL can be overridden via the RAMZARZ_URL env var (see config.js).
 */

/** Parse "2.39%" -> 2.39 (or null). */
function parsePercentText(text) {
    const m = text.match(/(\d+(?:\.\d+)?)\s*%/);
    return m ? parseFloat(m[1]) : null;
}

/** Bitcoin price in Toman from ramzarz.news. */
export async function fetchBitcoinPrice() {
    const html = await fetchTextSafe(getEndpoint("ramzarzUrl"), { timeoutMs: 20_000 });
    if (!html) throw new Error("ramzarz: unreachable");

    const tomanMatch = html.match(/data-price-toman="([\d.]+)"/);
    const value = tomanMatch ? parsePrice(tomanMatch[1]) : null;
    if (value == null) throw new Error("ramzarz: missing/invalid data-price-toman");
    if (!isWithinBounds(value, PRICE_BOUNDS.bitcoin)) throw new Error(`ramzarz: BTC out of range: ${value}`);

    // Change block follows the price; direction comes from the arrow class.
    let changePct = null;
    const seg = html.slice(html.indexOf("data-price-toman"), html.indexOf("data-price-toman") + 3000);
    const pct = parsePercentText(seg);
    if (pct != null) {
        const upIdx = seg.indexOf("arrow-up");
        const downIdx = seg.indexOf("arrow-down");
        if (downIdx !== -1 && (upIdx === -1 || downIdx < upIdx)) changePct = -pct;
        else if (upIdx !== -1) changePct = pct;
    }

    return {
        value,
        changePct,
        unit: "تومان",
        source: "ramzarz.news",
        sourceTime: null,
        updatedAt: tehranTime(),
    };
}


