import { fetchTgjuQuote } from "./tgju.js";
import { fetchMoj3Quote } from "./moj3.js";
import { rialToToman, isWithinBounds, PRICE_BOUNDS, tehranTime } from "./validate.js";

/**
 * USD free-market price in Toman.
 * Primary: moj3.ir (already Toman) — Fallback: TGJU (Rial ÷ 10).
 */
export async function fetchUsdPrice() {
    try {
        const quote = await fetchMoj3Quote("usd");
        const toman = quote.valueToman;

        if (!isWithinBounds(toman, PRICE_BOUNDS.usd)) {
            throw new Error(`USD price out of expected range: ${toman}`);
        }

        return {
            value: toman,
            changePct: quote.changePct,
            unit: "تومان",
            source: "moj3.ir",
            sourceTime: null,
            updatedAt: tehranTime(),
        };
    } catch (moj3Error) {
        console.error("[market] moj3 usd failed:", moj3Error.message);
    }

    const quote = await fetchTgjuQuote("usd");
    const toman = rialToToman(quote.valueRial);

    if (!isWithinBounds(toman, PRICE_BOUNDS.usd)) {
        throw new Error(`USD price out of expected range: ${toman}`);
    }

    return {
        value: toman,
        changePct: quote.changePct,
        unit: "تومان",
        source: "tgju.org",
        sourceTime: quote.quoteTime, // TGJU's own quote time
        updatedAt: tehranTime(),
    };
}

