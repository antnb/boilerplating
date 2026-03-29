// ══════════════════════════════════════
// Centralized Trusted Sources Registry
// ══════════════════════════════════════
// Add/remove external domains HERE ONLY.
// Both next.config.js (remotePatterns) and CSP headers
// read from this file — zero hardcoding elsewhere.
//
// USAGE: To add a new external service, add its domain(s)
// to the appropriate category below. CSP and image config
// will auto-update on next build/restart.

/** @type {Record<string, string[]>} */
const trustedSources = {
    /** Image CDNs and hosting services → CSP img-src + next/image remotePatterns */
    images: [
        "placehold.co",                 // Development placeholders
        "images.unsplash.com",          // Stock photography
        "lh3.googleusercontent.com",    // Google OAuth avatars
        "cdn.bmjplantstore.com",        // Production CDN
    ],

    /** External JavaScript → CSP script-src */
    scripts: [
        // "www.googletagmanager.com",  // ← Uncomment when adding Google Tag Manager
        // "www.google-analytics.com",  // ← Uncomment when adding GA4
    ],

    /** External CSS → CSP style-src */
    styles: [
        // "fonts.googleapis.com",      // ← Uncomment if using Google Fonts via CDN
    ],

    /** Font file sources → CSP font-src */
    fonts: [
        // "fonts.gstatic.com",         // ← Uncomment if using Google Fonts via CDN
    ],

    /** API/fetch/WebSocket destinations → CSP connect-src */
    connect: [
        // "www.google-analytics.com",  // ← Uncomment when adding GA4
        // "api.example.com",           // ← External REST API
    ],

    /** Allowed iframe sources → CSP frame-src (default: 'none') */
    frames: [
        // "www.youtube.com",           // ← Uncomment for embedded videos
        // "www.google.com",            // ← Uncomment for reCAPTCHA
    ],
};

// ═══════════════════════════════════════════════
// Helpers — DO NOT edit below unless changing CSP logic
// ═══════════════════════════════════════════════

/**
 * Convert trusted image sources to next/image remotePatterns format.
 * Used by next.config.js images.remotePatterns
 */
function getImageRemotePatterns() {
    return trustedSources.images.map((hostname) => ({
        protocol: "https",
        hostname: hostname,
    }));
}

/**
 * Build Content-Security-Policy header value from trusted sources.
 * Dynamically constructs each directive from the registry above.
 */
function buildCSP() {
    const fmt = (/** @type {string[]} */ arr) =>
        arr.length > 0 ? " " + arr.map((h) => `https://${h}`).join(" ") : "";

    const frameSrc = trustedSources.frames.length > 0
        ? trustedSources.frames.map((h) => `https://${h}`).join(" ")
        : "'none'";

    return [
        "default-src 'self'",
        // Next.js 14 requires 'unsafe-inline' + 'unsafe-eval' for hydration scripts
        `script-src 'self' 'unsafe-inline' 'unsafe-eval'${fmt(trustedSources.scripts)}`,
        `style-src 'self' 'unsafe-inline'${fmt(trustedSources.styles)}`,
        `img-src 'self' data: blob:${fmt(trustedSources.images)}`,
        `font-src 'self'${fmt(trustedSources.fonts)}`,
        `connect-src 'self'${fmt(trustedSources.connect)}`,
        `frame-src ${frameSrc}`,
        "frame-ancestors 'none'",
        "base-uri 'self'",
        "form-action 'self'",
    ].join("; ");
}

/** Non-CSP security headers — static, rarely change */
const securityHeaders = [
    // Clickjacking protection
    { key: "X-Frame-Options", value: "DENY" },
    // Prevent MIME type sniffing
    { key: "X-Content-Type-Options", value: "nosniff" },
    // Control referrer information leakage
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    // Legacy XSS filter for older browsers
    { key: "X-XSS-Protection", value: "1; mode=block" },
    // Force HTTPS (1 year, include subdomains, allow preload list)
    { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" },
    // Restrict browser features
    { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
];

module.exports = {
    trustedSources,
    getImageRemotePatterns,
    buildCSP,
    securityHeaders,
};
