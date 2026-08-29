import { fetchUsdPrice } from "./usd.js";
import { fetchGoldPrices } from "./gold.js";
import { fetchBitcoinPrice } from "./bitcoin.js";
import { createTtlCache } from "./cache.js";

/**
 * Public API of the market service.
 * getMarketPrices() returns per-price results that NEVER throw:
 *   { ok: true,  data: {...}, stale } | { ok: false, error }
 * so one broken source can never crash the bot or blank the message.
 */

// Fresh for 2 minutes; served (with a warning) for up to 15 minutes.
const FRESH_TTL_MS = 2 * 60 * 1000;
const MAX_STALE_MS = 15 * 60 * 1000;
const cache = createTtlCache(FRESH_TTL_MS, MAX_STALE_MS);

/** Wrap a source fetcher with cache + stale-serve + error isolation. */
async function getCachedPrice(key, fetcher) {
    const cached = cache.get(key);
    if (cached && !cached.stale) {
        return { ok: true, data: cached.value, stale: false };
    }

    try {
        const data = await fetcher();
        cache.set(key, data);
        return { ok: true, data, stale: false };
    } catch (error) {
        console.error(`[market] ${key} source failed:`, error.message);
        if (cached) {
            // Source is down right now — show the last known value, clearly flagged.
            return { ok: true, data: cached.value, stale: true };
        }
        return { ok: false, error: "منبع در دسترس نیست" };
    }
}

export async function getUsdPrice() {
    return getCachedPrice("usd", fetchUsdPrice);
}

export async function getGoldPrices() {
    return getCachedPrice("gold", fetchGoldPrices);
}

export async function getBitcoinPrice() {
    return getCachedPrice("bitcoin", fetchBitcoinPrice);
}

/**
 * Fetch all prices in parallel. Each price resolves to
 * { ok, data?, stale?, error? } — this function itself never throws.
 */
export async function getMarketPrices() {
    const [usd, gold, bitcoin] = await Promise.all([
        getUsdPrice(),
        getGoldPrices(),
        getBitcoinPrice(),
    ]);

    return { usd, gold, bitcoin, fetchedAt: new Date() };
}
