import { fetchTabdealPrice } from "./tabdeal.js";
import { tehranTime } from "./validate.js";

/**
 * Gold prices in Toman per gram from Tabdeal.
 * 18k comes from the GOLD/IRT token; 24k is derived (purity 0.75).
 * Emami coin is NOT available on Tabdeal, so it is not included.
 */
export async function fetchGoldPrices() {
    const [gold18, gold24] = await Promise.all([fetchTabdealPrice("gold18"), fetchTabdealPrice("gold24")]);

    return {
        gold18: { value: gold18.value, changePct: gold18.changePct, unit: "تومان / گرم" },
        gold24: { value: gold24.value, changePct: gold24.changePct, unit: "تومان / گرم" },
        source: gold18.source,
        sourceTime: null,
        updatedAt: tehranTime(),
    };
}
