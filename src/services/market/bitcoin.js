import { fetchTabdealPrice } from "./tabdeal.js";

/** Bitcoin price in Toman from Tabdeal (BTC/IRT). */
export async function fetchBitcoinPrice() {
    return fetchTabdealPrice("bitcoin");
}
