import { fetchTgjuQuote } from "./tgju.js";
import { fetchMoj3Quote } from "./moj3.js";
import { rialToToman, isWithinBounds, PRICE_BOUNDS, tehranTime } from "./validate.js";

/**
 * Gold prices in Toman.
 * Primary: moj3.ir (already Toman) — Fallback: TGJU (Rial ÷ 10).
 */
export async function fetchGoldPrices() {
    try {
        const [g18, g24, coin] = await Promise.all([
            fetchMoj3Quote("gold18"),
            fetchMoj3Quote("gold24"),
            fetchMoj3Quote("emamiCoin"),
        ]);

        const gold18 = g18.valueToman;
        const gold24 = g24.valueToman;
        const emamiCoin = coin.valueToman;

        if (!isWithinBounds(gold18, PRICE_BOUNDS.gold18)) {
            throw new Error(`Gold 18k price out of expected range: ${gold18}`);
        }

        return {
            gold18: { value: gold18, changePct: g18.changePct, unit: "تومان / گرم" },
            gold24: { value: gold24, changePct: g24.changePct, unit: "تومان / گرم" },
            emamiCoin: { value: emamiCoin, changePct: coin.changePct, unit: "تومان" },
            source: "moj3.ir",
            sourceTime: null,
            updatedAt: tehranTime(),
        };
    } catch (moj3Error) {
        console.error("[market] moj3 gold failed:", moj3Error.message);
    }

    // Fallback: TGJU (Rial ÷ 10)
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

