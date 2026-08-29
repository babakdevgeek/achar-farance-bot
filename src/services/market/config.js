const DEFAULTS = {
    tabdealUrl: "https://api-web.tabdeal.org/r/plots/currencies/dynamic-info/",
};

let config = { ...DEFAULTS };

/** Apply env overrides once at bot startup (called from bot.js). */
export function setMarketConfig(env = {}) {
    config = {
        tabdealUrl: env.TABDEAL_URL || DEFAULTS.tabdealUrl,
    };
}

/**
 * Resolve a configured endpoint URL.
 * @param {"tabdealUrl"} name
 */
export function getEndpoint(name) {
    const url = config[name];
    if (!url) throw new Error(`market endpoint "${name}" is not configured`);
    return url;
}
