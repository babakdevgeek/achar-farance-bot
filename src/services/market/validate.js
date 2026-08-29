/** Sanity bounds per price (in Toman). Values outside are rejected, never displayed. */
export const PRICE_BOUNDS = {
    usd: { min: 10_000, max: 10_000_000 },
    gold18: { min: 100_000, max: 1_000_000_000 },
    gold24: { min: 100_000, max: 2_000_000_000 },
    bitcoin: { min: 1_000_000, max: 1_000_000_000_000 },
};

/**
 * Parse a price string/number that may contain separators ("2,027,000").
 * @returns {number|null} null when not a usable number
 */
export function parsePrice(input) {
    if (typeof input === "number") {
        return Number.isFinite(input) ? input : null;
    }
    if (typeof input !== "string") return null;
    const normalized = input.replace(/[,٬\s]/g, "").replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d));
    const value = Number(normalized);
    return Number.isFinite(value) && value > 0 ? value : null;
}

/** Rial → Toman (1 Toman = 10 Rial). */
export function rialToToman(rial) {
    return rial / 10;
}

/** Check a price against sanity bounds. */
export function isWithinBounds(toman, bounds) {
    return Number.isFinite(toman) && toman >= bounds.min && toman <= bounds.max;
}

/** Tehran-local "HH:MM" string, used for "Updated:" lines. */
export function tehranTime(date = new Date()) {
    return date.toLocaleTimeString("en-GB", {
        timeZone: "Asia/Tehran",
        hour: "2-digit",
        minute: "2-digit",
    });
}

/** Minutes elapsed since a given Date. */
export function minutesSince(date) {
    return (Date.now() - date.getTime()) / 60_000;
}
