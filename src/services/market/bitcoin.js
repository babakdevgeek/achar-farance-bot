import { fetchJson, fetchJsonSafe } from "./http.js";
import { parsePrice, isWithinBounds, PRICE_BOUNDS, tehranTime } from "./validate.js";

/**
 * Bitcoin price in Toman from Iranian exchanges.
 * Primary:  Wallex  (api.wallex.ir, market BTCTMN, lastPrice in Toman)
 * Fallback: Bitpin  (api.bitpin.ir, market BTC/IRT, price in Toman)
 * Both are public JSON APIs; no auth required.
 */
const WALLEX_URL = "https://api.wallex.ir/v1/markets";
const BITPIN_URL = "https://api.bitpin.ir/v1/mkt/markets/";

/** Normalize an exchange result into the common price shape. */
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

async function fromWallex() {
    const data = await fetchJson(WALLEX_URL, { timeoutMs: 12_000 });
    const stats = data?.result?.symbols?.BTCTMN?.stats ?? data?.result?.markets?.BTCTMN?.stats;
    const raw = stats?.lastPrice ?? stats?.bidPrice;

    const value = parsePrice(raw);
    if (value == null) throw new Error("Wallex: missing/invalid BTCTMN lastPrice");
    if (!isWithinBounds(value, PRICE_BOUNDS.bitcoin)) throw new Error(`Wallex: BTC out of range: ${value}`);

    const changePct = typeof stats["24h_ch"] === "number" ? stats["24h_ch"] : null;
    return toPrice(value, "wallex.ir", changePct);
}

async function fromBitpin() {
    const data = await fetchJsonSafe(BITPIN_URL, { timeoutMs: 15_000 });
    if (!data?.results) throw new Error("Bitpin: unexpected response shape");

    const market = data.results.find((m) => m.currency1?.code === "BTC" && m.currency2?.code === "IRT");
    const value = parsePrice(market?.price_info?.price);
    if (value == null) throw new Error("Bitpin: missing/invalid BTC-IRT price");
    if (!isWithinBounds(value, PRICE_BOUNDS.bitcoin)) throw new Error(`Bitpin: BTC out of range: ${value}`);

    const changePct = typeof market?.price_info?.change === "number" ? market.price_info.change : null;
    return toPrice(value, "bitpin.ir", changePct);
}

/** Bitcoin price in Toman. Tries Wallex first, falls back to Bitpin. */
export async function fetchBitcoinPrice() {
    try {
        return await fromWallex();
    } catch (wallexError) {
        console.error("[market] wallex failed:", wallexError.message);
        return fromBitpin();
    }
}
