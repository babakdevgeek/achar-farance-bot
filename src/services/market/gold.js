import { fetchTgjuQuote } from "./tgju.js";
import { rialToToman, isWithinBounds, PRICE_BOUNDS, tehranTime } from "./validate.js";

/** Gold prices in Toman, from TGJU (Rial ÷ 10). */
export async function fetchGoldPrices() {
    // Sequential on purpose: they share one cached TGJU snapshot request.
    const [g18, g24, coin] = await Promise.all([
        fetchTgjuQuote("gold18"),
        fetchTgjuQuote("gold24"),
        fetchTgjuQuote("emamiCoin"),
    ]);

    const gold18 = rialToToman(g18.valueRial);
    const gold24 = rialToToman(g24.valueRial);
    const emamiCoin = rialToToman(coin.valueRial);

    if (!isWithinBounds(gold18, PRICE_BOUNDS.gold18)) {
        throw new Error(`Gold 18k price out of expected range: ${gold18}`);
    }

    return {
        gold18: { value: gold18, changePct: g18.changePct, unit: "تومان / گرم" },
        gold24: { value: gold24, changePct: g24.changePct, unit: "تومان / گرم" },
        emamiCoin: { value: emamiCoin, changePct: coin.changePct, unit: "تومان" },
        source: "tgju.org",
        sourceTime: g18.quoteTime,
        updatedAt: tehranTime(),
    };
}
