import { fetchTgjuQuote } from "./tgju.js";
import { fetchTabdealPrice } from "./tabdeal.js";
import { isWithinBounds, PRICE_BOUNDS, tehranTime } from "./validate.js";

/**
 * Gold prices in Toman.
 * Primary: TGJU (18k, 24k, Emami coin — works from Workers).
 * Fallback: Tabdeal GOLD/IRT token (18k + derived 24k, no coin).
 */
export async function fetchGoldPrices() {
    try {
        const [g18, g24, coin] = await Promise.all([
            fetchTgjuQuote("gold18"),
            fetchTgjuQuote("gold24"),
            fetchTgjuQuote("emamiCoin"),
        ]);

        if (!isWithinBounds(g18.valueToman, PRICE_BOUNDS.gold18)) {
            throw new Error(`Gold 18k price out of expected range: ${g18.valueToman}`);
        }

        return {
            gold18: { value: g18.valueToman, changePct: g18.changePct, unit: "تومان / گرم" },
            gold24: { value: g24.valueToman, changePct: g24.changePct, unit: "تومان / گرم" },
            emamiCoin: { value: coin.valueToman, changePct: coin.changePct, unit: "تومان" },
            source: "tgju.org",
            sourceTime: g18.quoteTime,
            updatedAt: tehranTime(),
        };
    } catch (tgjuError) {
        console.error("[market] tgju gold failed:", tgjuError.message);
    }

    // Fallback: Tabdeal gold token (no Emami coin available there).
    const [gold18, gold24] = await Promise.all([fetchTabdealPrice("gold18"), fetchTabdealPrice("gold24")]);
    return {
        gold18: { value: gold18.value, changePct: gold18.changePct, unit: "تومان / گرم" },
        gold24: { value: gold24.value, changePct: gold24.changePct, unit: "تومان / گرم" },
        emamiCoin: null,
        source: gold18.source,
        sourceTime: null,
        updatedAt: tehranTime(),
    };
}
