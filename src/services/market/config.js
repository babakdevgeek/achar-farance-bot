const DEFAULTS = {
    moj3Url: "https://moj3.ir/price/",
    tgjuUrl: "https://call1.tgju.org/ajax.json",
    ramzarzUrl: "https://ramzarz.news/coins/bitcoin/",
};

let config = { ...DEFAULTS };

/** Apply env overrides once at bot startup (called from bot.js). */
export function setMarketConfig(env = {}) {
    config = {
        moj3Url: env.MOJ3_URL || DEFAULTS.moj3Url,
        tgjuUrl: env.TGJU_URL || DEFAULTS.tgjuUrl,
        ramzarzUrl: env.RAMZARZ_URL || DEFAULTS.ramzarzUrl,
    };
}

/**
 * Resolve a configured endpoint URL.
 * @param {"tgjuUrl"|"moj3Url"|"ramzarzUrl"} name
 */
export function getEndpoint(name) {
    const url = config[name];
    if (!url) throw new Error(`market endpoint "${name}" is not configured`);
    return url;
}