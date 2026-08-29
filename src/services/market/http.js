/**
 * Minimal JSON fetch helper with timeout + retry.
 * Uses the global fetch (available in Node >= 18 and Cloudflare Workers),
 * so no extra dependency is needed.
 */

const DEFAULT_TIMEOUT_MS = 8_000;
const DEFAULT_RETRIES = 1; // 1 retry after the first failure (not aggressive)
const RETRY_DELAY_MS = 500;
const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";

async function fetchJsonOnce(url, timeoutMs, headers) {
    let res;
    try {
        res = await fetch(url, {
            headers: { Accept: "application/json", "User-Agent": USER_AGENT, ...headers },
            signal: AbortSignal.timeout(timeoutMs),
            // NOTE: no `cache` option here — the Cloudflare Workers runtime
            // throws "The 'cache' field on 'RequestInitializerDict' is not
            // implemented" for it, which broke every market request. Workers
            // don't cache cross-origin fetches by default anyway.
        });
    } catch (error) {
        // Network/DNS/TLS/timeout failures: unwrap the real cause for debugging.
        const cause = error?.cause?.message || error?.cause?.code || error?.name || "unknown";
        throw new Error(`fetch to ${url} failed: ${cause} (timeout ${timeoutMs}ms)`);
    }
    if (!res.ok) {
        throw new Error(`HTTP ${res.status} ${res.statusText} from ${url}`);
    }
    try {
        return await res.json();
    } catch (error) {
        throw new Error(`invalid JSON response from ${url}: ${error.message}`);
    }
}

/**
 * Fetch JSON with a timeout and a single retry.
 * @returns {Promise<any>} parsed JSON body
 * @throws {Error} if all attempts fail
 */
export async function fetchJson(url, { timeoutMs = DEFAULT_TIMEOUT_MS, retries = DEFAULT_RETRIES, headers } = {}) {
    let lastError;
    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            return await fetchJsonOnce(url, timeoutMs, headers);
        } catch (error) {
            lastError = error;
            if (attempt < retries) {
                await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
            }
        }
    }
    throw lastError;
}
