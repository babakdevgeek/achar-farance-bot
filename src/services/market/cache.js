/**
 * Small TTL cache with stale-serving.
 * - fresh (age <= ttl): returned with stale = false
 * - stale (ttl < age <= maxAge): returned with stale = true (caller must warn the user)
 * - expired (age > maxAge): not returned → caller refetches
 */
export function createTtlCache(ttlMs, maxAgeMs) {
    const store = new Map(); // key -> { value, fetchedAt }

    return {
        get(key) {
            const entry = store.get(key);
            if (!entry) return null;
            const age = Date.now() - entry.fetchedAt.getTime();
            if (age > maxAgeMs) {
                store.delete(key);
                return null;
            }
            return { ...entry, stale: age > ttlMs, ageMs: age };
        },
        set(key, value, fetchedAt = new Date()) {
            store.set(key, { value, fetchedAt });
        },
    };
}
