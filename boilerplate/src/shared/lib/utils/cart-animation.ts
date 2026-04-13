/** Spawn a small cart icon that flies from an element toward the top-right cart icon */
export function spawnFlyingParticle(el: HTMLElement) {
    const rect = el.getBoundingClientRect();
    const particle = document.createElement("div");

    // Find the cart icon in navbar as target, fallback to top-right
    const cartBtn = document.querySelector('[aria-label="Open cart"]');
    const cartRect = cartBtn?.getBoundingClientRect();
    const targetX = cartRect ? cartRect.left + cartRect.width / 2 : window.innerWidth - 60;
    const targetY = cartRect ? cartRect.top + cartRect.height / 2 : 24;

    const startX = rect.left + rect.width / 2;
    const startY = rect.top + rect.height / 2;

    // Read computed CSS variable values from root
    const root = document.documentElement;
    const primaryHsl = getComputedStyle(root).getPropertyValue("--primary").trim();
    const primaryFgHsl = getComputedStyle(root).getPropertyValue("--primary-foreground").trim();
    const bg = primaryHsl ? `hsl(${primaryHsl})` : "#1b3a2d";
    const fg = primaryFgHsl ? `hsl(${primaryFgHsl})` : "#fff";

    Object.assign(particle.style, {
        position: "fixed",
        left: `${startX}px`,
        top: `${startY}px`,
        zIndex: "9999",
        pointerEvents: "none",
        width: "32px",
        height: "32px",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: bg,
        color: fg,
        boxShadow: `0 4px 20px ${primaryHsl ? `hsl(${primaryHsl} / 0.5)` : "rgba(0,0,0,0.3)"}`,
        transform: "scale(1)",
        opacity: "1",
        willChange: "transform, left, top, opacity",
    });

    particle.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>`;

    document.body.appendChild(particle);

    // Force layout calculation, then animate on next frame
    void particle.offsetHeight;

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            particle.style.transition = "all 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)";
            particle.style.left = `${targetX}px`;
            particle.style.top = `${targetY}px`;
            particle.style.transform = "scale(0.3)";
            particle.style.opacity = "0";
        });
    });

    setTimeout(() => particle.remove(), 750);
}
