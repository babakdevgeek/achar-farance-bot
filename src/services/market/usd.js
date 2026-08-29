import { fetchTabdealPrice } from "./tabdeal.js";

/**
 * USD price in Toman from Tabdeal (USDT/IRT).
 * Note: this is the Tether rate, a close proxy for the free-market USD rate.
 */
export async function fetchUsdPrice() {
    return fetchTabdealPrice("usd");
}
