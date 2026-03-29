const {
    getImageRemotePatterns,
    buildCSP,
    securityHeaders,
} = require("./src/config/security.config");

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    // FIX: allow dev origins
    allowedDevOrigins: [
        "http://localhost",
        "http://127.0.0.1",
        "http://localhost:3002",
        "http://127.0.0.1:3000",
    ],
    images: {
        // Reads from src/config/security.config.js — do NOT hardcode domains here
        remotePatterns: getImageRemotePatterns(),
        // Only allow local images from these paths
        localPatterns: [
            { pathname: "/images/**" },
            { pathname: "/uploads/**" },
        ],
        // Optimize image formats
        formats: ["image/avif", "image/webp"],
        // Cache optimized images for 1 year
        minimumCacheTTL: 31536000,
    },
    async headers() {
        return [
            {
                // Apply security headers to all routes
                source: "/(.*)",
                headers: [
                    ...securityHeaders,
                    {
                        key: "Content-Security-Policy",
                        value: buildCSP(),
                    },
                ],
            },
        ];
    },
};

module.exports = nextConfig;
