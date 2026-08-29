import { fetchTextSafe } from "./http.js";
import { parsePrice } from "./validate.js";
import { getEndpoint } from "./config.js";

/**
 * moj3.ir/price — server-rendered HTML tables (no public JSON API; their own
 * widget uses a nonce-protected endpoint). The table structure is stable:
 *   [name, price(Toman), bubble, change%, change amount]
 * Values are already in TOMAN (no Rial conversion needed).
 */
const MOJ3_URL = "https://moj3.ir/price/"; // default; overridable via MOJ3_URL env var

/** moj3 row name -> internal item key. */
export const MOJ3_ITEMS = {
    usd: "دلار",
    gold18: "طلای 18 عیار",
    gold24: "طلای 24 عیار",
    emamiCoin: "سکه طرح جدید",
};

/** Strip tags + whitespace from an HTML cell. */
function cellText(cell) {
    return cell
        .replace(/<[^>]+>/g, " ")
        .replace(/&nbsp;/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

/** Parse "+1.79%" / "-0.6%" / "0%" -> number, or null. */
function parsePercent(cell) {
    const m = cell.match(/-?\+?\d+(?:\.\d+)?\s*%/);
    return m ? parseFloat(m[0]) : null;
}

function extractRows(html) {
    // First table on the page holds the main price list.
    const table = html.match(/<table[\s\S]*?<\/table>/);
    if (!table) throw new Error("moj3: no price table found");

    return [...table[0].matchAll(/<tr[\s\S]*?<\/tr>/g)]
        .map((row) => [...row[0].matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/g)].map((c) => cellText(c[1])))
        .filter((cells) => cells.length >= 2);
}

/**
 * Fetch a price from moj3.ir/price.
 * @param {string} itemKey one of MOJ3_ITEMS keys
 * @returns {Promise<{ valueToman: number, changePct: number|null }>}
 * @throws {Error} when the page/table/row is missing or the value is invalid
 */
export async function fetchMoj3Quote(itemKey) {
    const rowName = MOJ3_ITEMS[itemKey];
    if (!rowName) throw new Error(`unknown moj3 item: ${itemKey}`);

    const html = await fetchTextSafe(getEndpoint("moj3Url"), { timeoutMs: 15_000 });
    if (!html || typeof html !== "string") throw new Error("moj3: unreachable");

    const rows = extractRows(html);
    const row = rows.find((cells) => cells[0] === rowName);
    if (!row) throw new Error(`moj3: row "${rowName}" not found`);

    const valueToman = parsePrice(row[1]);
    if (valueToman == null || valueToman <= 0) {
        throw new Error(`moj3: "${rowName}" has invalid price: ${row[1]}`);
    }

    return { valueToman, changePct: parsePercent(row[3] ?? "") };
}
