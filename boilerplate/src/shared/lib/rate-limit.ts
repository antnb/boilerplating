// ══════════════════════════════════════
// In-Memory Rate Limiter
// ══════════════════════════════════════
// Sliding window counter per key (IP address).
// Zero external dependencies — uses Map.
// Production upgrade: swap Map for Upstash Redis.

type RateLimitEntry = {
    count: number;
    resetAt: number; // timestamp ms
};

type RateLimitConfig = {
    /** Max requests allowed per window */
    maxAttempts: number;
    /** Window duration in milliseconds */
    windowMs: number;
};

type RateLimitResult = {
    success: boolean;
    remaining: number;
    resetAt: number;
};

const stores = new Map<string, Map<string, RateLimitEntry>>();

// Auto-cleanup expired entries every 60 seconds to prevent memory leak
if (typeof globalThis !== "undefined" && typeof setInterval !== "undefined") {
    const cleanup = () => {
        const now = Date.now();
        stores.forEach((store) => {
            store.forEach((entry, key) => {
                if (entry.resetAt <= now) store.delete(key);
            });
        });
    };

    // Store interval ref on globalThis to prevent duplicate intervals in HMR
    const g = globalThis as unknown as { __rateLimitCleanup?: ReturnType<typeof setInterval> };
    if (!g.__rateLimitCleanup) {
        g.__rateLimitCleanup = setInterval(cleanup, 60_000);
    }
}

/**
 * Create a named rate limiter instance.
 *
 * @param name - Unique name for this limiter (e.g. "auth-login")
 * @param config - Max attempts and window duration
 * @returns Object with `check(key)` method
 *
 * @example
 * ```ts
 * const loginLimiter = rateLimit("auth-login", {
 *     maxAttempts: 5,
 *     windowMs: 15 * 60 * 1000, // 15 minutes
 * });
 *
 * const result = loginLimiter.check(clientIP);
 * if (!result.success) {
 *     // Return 429
 * }
 * ```
 */
export function rateLimit(name: string, config: RateLimitConfig) {
    if (!stores.has(name)) stores.set(name, new Map());
    const store = stores.get(name)!;

    return {
        /**
         * Check if a key (IP) has exceeded the rate limit.
         * Automatically increments the counter.
         */
        check(key: string): RateLimitResult {
            const now = Date.now();
            const entry = store.get(key);

            // Window expired or first request — start new window
            if (!entry || entry.resetAt <= now) {
                store.set(key, {
                    count: 1,
                    resetAt: now + config.windowMs,
                });
                return {
                    success: true,
                    remaining: config.maxAttempts - 1,
                    resetAt: now + config.windowMs,
                };
            }

            // Within window — increment
            entry.count += 1;

            if (entry.count > config.maxAttempts) {
                return {
                    success: false,
                    remaining: 0,
                    resetAt: entry.resetAt,
                };
            }

            return {
                success: true,
                remaining: config.maxAttempts - entry.count,
                resetAt: entry.resetAt,
            };
        },

        /** Reset/clear a specific key's rate limit counter */
        reset(key: string): void {
            store.delete(key);
        },
    };
}
