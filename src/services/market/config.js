const DEFAULTS = {
    tgjuUrl: "https://call1.tgju.org/ajax.json",
    tabdealUrl: "https://api-web.tabdeal.org/r/plots/currencies/dynamic-info/",
};

let config = { ...DEFAULTS };

/** Apply env overrides once at bot startup (called from bot.js). */
export function setMarketConfig(env = {}) {
    config = {
        tgjuUrl: env.TGJU_URL || DEFAULTS.tgjuUrl,
        tabdealUrl: env.TABDEAL_URL || DEFAULTS.tabdealUrl,
    };
}

/**
 * Resolve a configured endpoint URL.
 * @param {"tgjuUrl"|"tabdealUrl"} name
 */
export function getEndpoint(name) {
    const url = config[name];
    if (!url) throw new Error(`market endpoint "${name}" is not configured`);
    return url;
}
