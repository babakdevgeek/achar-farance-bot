import { fetchJsonSafe } from "./http.js";
import { parsePrice, isWithinBounds, PRICE_BOUNDS, tehranTime } from "./validate.js";
import { getEndpoint } from "./config.js";

/**
 * Bitcoin price in Toman from Bitpin (market BTC/IRT, price in Toman).
 * Public JSON API; no auth required.
 * URL can be overridden via the BITPIN_URL env var (see config.js).
 */

/** Normalize the result into the common price shape. */
function toPrice(value, source, changePct = null) {
    return {
        value,
        changePct,
        unit: "تومان",
        source,
        sourceTime: null, // exchanges don't provide a human quote time
        updatedAt: tehranTime(),
    };
}

/** Bitcoin price in Toman from Bitpin. */
export async function fetchBitcoinPrice() {
    const data = await fetchJsonSafe(getEndpoint("bitpinUrl"), { timeoutMs: 15_000 });
    if (!data?.results) throw new Error("Bitpin: unexpected response shape");

    const market = data.results.find((m) => m.currency1?.code === "BTC" && m.currency2?.code === "IRT");
    const value = parsePrice(market?.price_info?.price);
    if (value == null) throw new Error("Bitpin: missing/invalid BTC-IRT price");
    if (!isWithinBounds(value, PRICE_BOUNDS.bitcoin)) throw new Error(`Bitpin: BTC out of range: ${value}`);

    const changePct = typeof market?.price_info?.change === "number" ? market.price_info.change : null;
    return toPrice(value, "bitpin.ir", changePct);
}

