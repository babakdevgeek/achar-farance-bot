/**
 * Minimal JSON fetch helper with timeout + retry.
 * Uses the global fetch (available in Node >= 18 and Cloudflare Workers),
 * so no extra dependency is needed.
 */

const DEFAULT_TIMEOUT_MS = 8_000;
const DEFAULT_RETRIES = 1; // 1 retry after the first failure (not aggressive)
const RETRY_DELAY_MS = 500;
const USER_AGENT = "Mozilla/5.0 (compatible; achar-farance-bot)";

async function fetchJsonOnce(url, timeoutMs, headers) {
    const res = await fetch(url, {
        headers: { Accept: "application/json", "User-Agent": USER_AGENT, ...headers },
        signal: AbortSignal.timeout(timeoutMs),
        cache: "no-store",
    });
    if (!res.ok) {
        throw new Error(`HTTP ${res.status} from ${url}`);
    }
    return res.json();
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

/** Fetch JSON, returning null instead of throwing (for optional/fallback sources). */
export async function fetchJsonSafe(url, options) {
    try {
        return await fetchJson(url, options);
    } catch (error) {
        console.error(`[market] request failed: ${url}:`, error.message);
        return null;
    }
}

/** Fetch a raw text body (HTML pages), null on failure. */
export async function fetchTextSafe(url, options) {
    try {
        const res = await fetch(url, {
            headers: { "User-Agent": USER_AGENT, ...options?.headers },
            signal: AbortSignal.timeout(options?.timeoutMs ?? DEFAULT_TIMEOUT_MS),
            cache: "no-store",
        });
        if (!res.ok) throw new Error(`HTTP ${res.status} from ${url}`);
        return await res.text();
    } catch (error) {
        console.error(`[market] request failed: ${url}:`, error.message);
        return null;
    }
}
