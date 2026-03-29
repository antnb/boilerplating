

interface ProductJsonLdProps {
    name: string;
    description: string;
    image?: string;
    price: number;
    currency: string;
    availability: "InStock" | "OutOfStock" | "PreOrder";
    sku: string;
    brand: string;
    url: string;
    ratingValue?: number;
    reviewCount?: number;
}

/**
 * Renders Product structured data as JSON-LD for SEO.
 * https://schema.org/Product
 */
export default function ProductJsonLd({
    name,
    description,
    image,
    price,
    currency,
    availability,
    sku,
    brand,
    url,
    ratingValue,
    reviewCount,
}: ProductJsonLdProps) {
    const data: Record<string, unknown> = {
        "@context": "https://schema.org",
        "@type": "Product",
        name,
        description,
        sku,
        brand: { "@type": "Brand", name: brand },
        offers: {
            "@type": "Offer",
            price,
            priceCurrency: currency,
            availability: `https://schema.org/${availability}`,
            url,
        },
    };

    if (image) data.image = image;

    if (ratingValue && reviewCount) {
        data.aggregateRating = {
            "@type": "AggregateRating",
            ratingValue,
            reviewCount,
            bestRating: 5,
            worstRating: 1,
        };
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
    );
}
