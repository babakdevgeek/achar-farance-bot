const DEFAULTS = {
    moj3Url: "https://moj3.ir/price/",
    tgjuUrl: "https://call1.tgju.org/ajax.json",
    bitpinUrl: "https://api.bitpin.ir/v1/mkt/markets/",
    proxyUrl: null,
};

let config = { ...DEFAULTS };

/** Apply env overrides once at bot startup (called from bot.js). */
export function setMarketConfig(env = {}) {
    config = {
        moj3Url: env.MOJ3_URL || DEFAULTS.moj3Url,
        tgjuUrl: env.TGJU_URL || DEFAULTS.tgjuUrl,
        bitpinUrl: env.BITPIN_URL || DEFAULTS.bitpinUrl,
        proxyUrl: env.MARKET_PROXY_URL || null,
    };
}

/**
 * Resolve a configured endpoint. When MARKET_PROXY_URL is set, requests are
 * routed through the relay as: <relay>?url=<encoded target>.
 * @param {"tgjuUrl"|"moj3Url"|"bitpinUrl"} name
 */
export function getEndpoint(name) {
    const url = config[name];
    if (!url) throw new Error(`market endpoint "${name}" is not configured`);
    if (config.proxyUrl) {
        return `${config.proxyUrl}${config.proxyUrl.includes("?") ? "&" : "?"}url=${encodeURIComponent(url)}`;
    }
    return url;
}