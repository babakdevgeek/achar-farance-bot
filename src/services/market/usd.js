import { fetchTgjuQuote } from "./tgju.js";
import { fetchTabdealPrice } from "./tabdeal.js";
import { isWithinBounds, PRICE_BOUNDS, tehranTime } from "./validate.js";

/**
 * USD free-market price in Toman.
 * Primary: TGJU (works from Cloudflare Workers) — Fallback: Tabdeal USDT/IRT.
 */
export async function fetchUsdPrice() {
    try {
        const quote = await fetchTgjuQuote("usd");
        const toman = quote.valueToman;

        if (!isWithinBounds(toman, PRICE_BOUNDS.usd)) {
            throw new Error(`USD price out of expected range: ${toman}`);
        }

        return {
            value: toman,
            changePct: quote.changePct,
            unit: "تومان",
            source: "tgju.org",
            sourceTime: quote.quoteTime,
            updatedAt: tehranTime(),
        };
    } catch (tgjuError) {
        console.error("[market] tgju usd failed:", tgjuError.message);
    }

    // Fallback: Tabdeal USDT/IRT (Tether rate proxy).
    const price = await fetchTabdealPrice("usd");
    return { ...price, unit: "تومان" };
}
