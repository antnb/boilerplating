import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: "class",
    content: ["./src/**/*.{ts,tsx,js,jsx}"],
    theme: {
        extend: {
            fontFamily: {
                sans: ["var(--font-inter)", "system-ui", "sans-serif"],
                serif: ["var(--font-playfair)", "Georgia", "serif"],
                mono: ["Menlo", "monospace"],
            },
            colors: {
                /* Semantic tokens (shadcn-compatible) */
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                /* Brand colors */
                brand: {
                    dark: "hsl(var(--brand-dark))",
                    bg: "hsl(var(--brand-bg))",
                    accent: "hsl(var(--brand-accent))",
                    surface: "hsl(var(--brand-surface))",
                    border: "hsl(var(--brand-border))",
                    gray: "hsl(var(--brand-gray))",
                    "off-white": "hsl(var(--brand-off-white))",
                    danger: "hsl(var(--brand-danger))",
                    success: "hsl(var(--brand-success))",
                    warning: "hsl(var(--brand-warning))",
                    text: "hsl(var(--brand-text))",
                    "text-muted": "hsl(var(--brand-text-muted))",
                    "forest-light": "hsl(var(--brand-forest-light))",
                    "forest-dark": "hsl(var(--brand-forest-dark))",
                    sage: "hsl(var(--brand-sage))",
                    earth: "hsl(var(--brand-earth))",
                    deep: "hsl(var(--brand-forest-dark))",
                },
                /* Plant PDP semantic tokens */
                plant: {
                    green: "hsl(var(--plant-green))",
                    "green-light": "hsl(var(--plant-green-light))",
                    gold: "hsl(var(--plant-gold))",
                    cream: "hsl(var(--plant-cream))",
                    "cream-dark": "hsl(var(--plant-cream-dark))",
                    text: "hsl(var(--plant-text))",
                    "text-muted": "hsl(var(--plant-text-muted))",
                    border: "hsl(var(--plant-border))",
                    "badge-bg": "hsl(var(--plant-badge-bg))",
                    "badge-text": "hsl(var(--plant-badge-text))",
                },
                "section-alt": "hsl(var(--section-alt))",
                product: {
                    green: "#8BA67D",
                    "green-dark": "#617553",
                    "bg-light": "#F2F2F2",
                    orange: "#E87E4E",
                },
                whatsapp: {
                    DEFAULT: "#25D366",
                    hover: "#20BD5A",
                },
            },
            borderColor: {
                DEFAULT: "hsl(var(--border))",
            },
            fontSize: {
                "2xs": ["10px", "14px"],
                "3xs": ["8px", "10px"],
            },
            boxShadow: {
                soft: "0 2px 8px -2px rgba(0, 0, 0, 0.08), 0 4px 12px -4px rgba(0, 0, 0, 0.05)",
                hover:
                    "0 8px 24px -8px rgba(0, 0, 0, 0.12), 0 12px 32px -12px rgba(0, 0, 0, 0.08)",
            },
            borderRadius: {
                "bento-sm": "16px",
            },
            keyframes: {
                "fade-in-up": {
                    from: { opacity: "0", transform: "translateY(10px)" },
                    to: { opacity: "1", transform: "translateY(0)" },
                },
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
            },
            animation: {
                "fade-in-up": "fade-in-up 0.4s ease-out both",
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
            },
        },
    },
    plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
};

export default config;
