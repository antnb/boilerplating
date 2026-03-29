import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
    testDir: "./e2e",
    fullyParallel: false,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: 1, // Sequential — shared DB + rate limiter state
    reporter: [["html"], ["list"]],
    timeout: 30_000,
    expect: { timeout: 5_000 },
    use: {
        baseURL: "http://localhost:3002",
        trace: "on-first-retry",
        screenshot: "only-on-failure",
        video: "on-first-retry",
    },
    projects: [
        {
            name: "Desktop Chrome",
            use: { ...devices["Desktop Chrome"] },
        },
    ],
    webServer: {
        command: "npx next start -p 3002",
        url: "http://localhost:3002",
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
    },
});
