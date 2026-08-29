import { fetchTgjuQuote } from "./tgju.js";
import { rialToToman, isWithinBounds, PRICE_BOUNDS, tehranTime } from "./validate.js";

/** USD free-market price in Toman, from TGJU (Rial ÷ 10). */
export async function fetchUsdPrice() {
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
