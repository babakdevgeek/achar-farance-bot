import { fetchTgjuQuote } from "./tgju.js";
import { fetchTabdealPrice } from "./tabdeal.js";
import { isWithinBounds, PRICE_BOUNDS, tehranTime } from "./validate.js";

/**
 * Bitcoin price in Toman.
 * Primary: TGJU — BTC is quoted in USD there, so multiply by the TGJU USD
 * rate (both from the same snapshot, so they are consistent).
 * Fallback: Tabdeal BTC/IRT order book — reachable from Iran.
 */
export async function fetchBitcoinPrice() {
    try {
        const [btc, usd] = await Promise.all([fetchTgjuQuote("bitcoin"), fetchTgjuQuote("usd")]);
        if (!btc.isUsdQuote) throw new Error("tgju: bitcoin quote not in USD as expected");

        const toman = btc.valueToman * usd.valueToman;
        if (!isWithinBounds(toman, PRICE_BOUNDS.bitcoin)) {
            throw new Error(`BTC price out of expected range: ${toman}`);
        }

        return {
            value: toman,
            changePct: btc.changePct, // USD change ≈ Toman change for BTC
            unit: "تومان",
            source: "tgju.org",
            sourceTime: btc.quoteTime,
            updatedAt: tehranTime(),
        };
    } catch (tgjuError) {
        console.error("[market] tgju bitcoin failed:", tgjuError.message);
    }

    // Fallback: Tabdeal BTC/IRT.
    return fetchTabdealPrice("bitcoin");
}
