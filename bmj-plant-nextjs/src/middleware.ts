import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { rateLimit } from "@/lib/rate-limit";
import { ROLE_IDS } from "@/lib/constants/roles";

// ── Rate limiters (created once, persist across requests) ──
const loginLimiter = rateLimit("auth-login", {
    maxAttempts: 50, // 50 attempts per window — prevents brute-force while allowing full E2E suite
    windowMs: 15 * 60 * 1000, // 15 minutes
});

function getClientIP(request: NextRequest): string {
    return (
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        request.headers.get("x-real-ip") ||
        request.ip ||
        "unknown"
    );
}

// ── Routes that require authentication ──
// Only these specific routes are guarded. Everything else passes through.
// When adding new protected routes, add them here.
const protectedPaths = ["/account", "/dashboard", "/checkout"];

// ── Routes that require admin role ──
const adminPaths = ["/manage"];

function isProtectedRoute(pathname: string): boolean {
    return protectedPaths.some(
        (path) => pathname === path || pathname.startsWith(`${path}/`)
    );
}

function isAdminRoute(pathname: string): boolean {
    return adminPaths.some(
        (path) => pathname === path || pathname.startsWith(`${path}/`)
    );
}

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // ── Rate limiting for auth API endpoints (POST only) ──
    if (
        request.method === "POST" &&
        pathname === "/api/auth/callback/credentials"
    ) {
        const ip = getClientIP(request);
        const result = loginLimiter.check(ip);

        if (!result.success) {
            const retryAfterSeconds = Math.ceil(
                (result.resetAt - Date.now()) / 1000
            );
            return NextResponse.json(
                { error: "Terlalu banyak percobaan login. Coba lagi nanti." },
                {
                    status: 429,
                    headers: {
                        "Retry-After": String(retryAfterSeconds),
                        "X-RateLimit-Remaining": "0",
                        "X-RateLimit-Reset": new Date(result.resetAt).toISOString(),
                    },
                }
            );
        }
    }

    // ── Protected routes — require authentication ──
    if (isProtectedRoute(pathname) || isAdminRoute(pathname)) {
        const token = await getToken({ req: request });

        if (!token) {
            const loginUrl = new URL("/login", request.url);
            loginUrl.searchParams.set("callbackUrl", pathname);
            return NextResponse.redirect(loginUrl);
        }

        // Admin-only routes — require admin role (integer comparison)
        // roleId is guaranteed by JWT callback self-healing in auth.ts
        if (isAdminRoute(pathname) && token.roleId !== ROLE_IDS.ADMIN) {
            return NextResponse.redirect(new URL("/", request.url));
        }
    }

    // ── Everything else passes through ──
    // Next.js handles: render matching page OR return 404 via not-found.tsx
    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"],
};
