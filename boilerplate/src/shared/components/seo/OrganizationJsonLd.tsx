// Server Component — renders once in storefront layout

export function OrganizationJsonLd() {
    const data = {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "BMJ Plant Store",
        alternateName: "PT Bumi Mekarsari Jaya",
        url: "https://bmjplantstore.com",
        logo: "https://bmjplantstore.com/logo.png",
        description: "Toko tanaman hias premium — koleksi Monstera, Philodendron, Alocasia, dan tanaman tropis langka.",
        address: {
            "@type": "PostalAddress",
            addressCountry: "ID",
            addressLocality: "Jakarta",
        },
        contactPoint: {
            "@type": "ContactPoint",
            contactType: "customer service",
            availableLanguage: ["id", "en"],
        },
        sameAs: [
            "https://www.instagram.com/bmjplantstore",
            "https://www.facebook.com/bmjplantstore",
        ],
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
    );
}
