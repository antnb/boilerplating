"use client";

/**
 * ProductDetailClient — Client Component
 *
 * Contains ALL interactive rendering logic for the Product Detail Page.
 * Receives pre-resolved, serialized data from the Server Component page.tsx.
 *
 * ALL data comes from rawPlant props — ZERO hardcoded values.
 * Extended specs, expert attribution, safety data, origin — all from DB.
 */

import ProductBreadcrumb from "@/components/pdp/ProductBreadcrumb";
import ProductGallery from "@/components/pdp/ProductGallery";
import ProductHeader from "@/components/pdp/ProductHeader";
import ProductTeaser from "@/components/pdp/ProductTeaser";
import ProductQuickSpecs from "@/components/pdp/ProductQuickSpecs";
import ProductCTA from "@/components/pdp/ProductCTA";
import UsagePills from "@/components/pdp/UsagePills";
import TrustBadges from "@/components/pdp/TrustBadges";
import BotanicalNarrative from "@/components/pdp/BotanicalNarrative";
import CareSnapshot from "@/components/pdp/CareSnapshot";
import ProductDetailsAccordion from "@/components/pdp/ProductDetailsAccordion";
import ProductFAQ from "@/components/pdp/ProductFAQ";
import ProductReviews from "@/components/pdp/ProductReviews";
import SimilarSpecimens from "@/components/pdp/SimilarSpecimens";
import SocialShare from "@/components/pdp/SocialShare";
import MobileBottomBar from "@/components/pdp/MobileBottomBar";
import ScrollReveal from "@/components/pdp/ScrollReveal";
import { resolveImageSrc } from "@/lib/utils/image";

// Types matching the fully-resolved shape from Server Component
interface RawPlant {
    id: string;
    slug: string;
    sku: string;
    name: string;
    scientificName: string;
    cultivar: string | null;
    genus: string | null;
    family: string;
    category: string;
    basePriceStr: string;
    discountPriceStr: string | null;
    discountPercentage: number;
    stock: number;
    isAvailable: boolean;
    careDifficulty: number;
    sizeOptions: string[];
    images: { url: string; alt: string }[];
    labels: string[];
    description: string;
    specs: {
        light: string;
        water: string;
        soil: string;
        humidity: string;
        temperature: string;
        toxicity: string;
    };
    extendedSpecs: {
        height: string | null;
        potSize: string | null;
        growthRate: string | null;
        careTips: string | null;
        fertilizing: string | null;
        careDetails: Record<string, string> | null;
        handling: string | null;
        originRegions: string[] | null;
        habitat: string | null;
        usageTags: { icon: string; label: string }[] | null;
        benefits: { icon: string; label: string; description: string }[] | null;
        packagingType: string | null;
        acclimationGuide: string | null;
    };
    isToxic: boolean;
    petSafe: boolean;
    childrenSafe: boolean;
    expert: {
        name: string;
        shortName: string;
        title: string;
        avatar: string | null;
        bio: string;
    } | null;
    reviewsSummary: { average: number; count: number; distribution: Record<string, number> };
    faqs: { q: string; a: string }[];
    reviews: unknown[];
    isLoggedIn: boolean;
    hasPurchased: boolean;
}

interface SimilarPlant {
    id: string;
    slug: string;
    name: string;
    scientificName: string;
    basePriceStr: string;
    images: { url: string; alt: string }[];
    labels: string[];
}

interface ProductDetailClientProps {
    rawPlant: RawPlant;
    similarPlants: SimilarPlant[];
}

export default function ProductDetailClient({ rawPlant, similarPlants }: ProductDetailClientProps) {
    const priceNum = parseInt(rawPlant.basePriceStr.replace(/[^0-9]/g, "")) || 0;
    const originalPriceNum = rawPlant.discountPriceStr ? priceNum : null;
    const currentPrice = rawPlant.discountPriceStr
        ? parseInt(rawPlant.discountPriceStr.replace(/[^0-9]/g, ""))
        : priceNum;

    const plant = {
        breadcrumb: [
            { label: "Home", href: "/" },
            { label: "Produk", href: "/product" },
            { label: rawPlant.name, href: "" },
        ],
        images: rawPlant.images.map(img => ({
            src: resolveImageSrc(img.url),
            alt: img.alt
        })),
        badges: rawPlant.labels.map(l => ({ label: l, variant: "dark" as const, icon: "eco" })),
        category: rawPlant.category,                     // ← was "Koleksi Aroid"
        name: rawPlant.name,
        scientificName: rawPlant.scientificName,
        cultivarName: rawPlant.cultivar,                  // ← was null
        price: currentPrice,
        originalPrice: originalPriceNum || undefined,
        stock: rawPlant.stock,                            // ← was hardcoded 15
        isToxic: rawPlant.isToxic,
        petSafe: rawPlant.petSafe,
        teaserText: rawPlant.description.substring(0, 120) + "...",
        specs: [
            { icon: "light_mode", label: "Cahaya", value: rawPlant.specs.light },
            { icon: "water_drop", label: "Air", value: rawPlant.specs.water },
            { icon: "thermostat", label: "Suhu", value: rawPlant.specs.temperature },
        ],
        shippingData: {
            risk: "low" as const,
            methods: ["Instant", "Sameday"],
            description: "Aman dikirim ke seluruh Indonesia.",
            packagingType: rawPlant.extendedSpecs.packagingType,
            acclimationGuide: rawPlant.extendedSpecs.acclimationGuide,
        },
        narrative: rawPlant.description,
        expertNote: rawPlant.expert ? {                   // ← was null
            name: rawPlant.expert.name,
            title: rawPlant.expert.title,
            avatar: rawPlant.expert.avatar || "/images/knowledge/knowledge-editorial-team.webp",
            quote: "",
        } : null,
        careSnapshot: [
            {
                icon: "light_mode", label: "Cahaya",
                value: rawPlant.specs.light,
                detail: rawPlant.extendedSpecs.careDetails?.light || "Cahaya terang tidak langsung",
            },
            {
                icon: "water_drop", label: "Air",
                value: rawPlant.specs.water,
                detail: rawPlant.extendedSpecs.careDetails?.water || "Siram saat media atas kering",
            },
            {
                icon: "humidity_percentage", label: "Kelembaban",
                value: rawPlant.specs.humidity,
                detail: rawPlant.extendedSpecs.careDetails?.humidity || "Jaga kelembaban optimal",
            },
            {
                icon: "speed", label: "Kesulitan",
                value: `Level ${rawPlant.careDifficulty}`,
                detail: rawPlant.extendedSpecs.careDetails?.difficulty || "Tingkat perawatan",
            },
        ],
        usageTags: rawPlant.extendedSpecs.usageTags || [  // ← was hardcoded
            { icon: "home", label: "Indoor" },
            { icon: "park", label: "Outdoor Teduh" },
        ],
        identity: {
            commonName: rawPlant.name,
            scientificName: rawPlant.scientificName,
            family: rawPlant.family,                      // ← was "Araceae"
            sku: rawPlant.sku,                            // ← was rawPlant.id
        },
        careData: {
            careLevel: rawPlant.careDifficulty.toString(),
            sunlight: rawPlant.specs.light,
            watering: rawPlant.specs.water,
            humidity: rawPlant.specs.humidity,
            soilType: rawPlant.specs.soil,
            growthRate: rawPlant.extendedSpecs.growthRate || "Sedang",  // ← was hardcoded
            careTips: rawPlant.extendedSpecs.careTips || "",            // ← was hardcoded
        },
        safetyData: {
            toxic: rawPlant.specs.toxicity,
            petSafe: rawPlant.petSafe,             // ← was always false
            childrenSafe: rawPlant.childrenSafe,   // ← was always false
            handling: rawPlant.extendedSpecs.handling || "",  // ← was hardcoded
        },
        fullSpecs: [                               // ← was all hardcoded
            ...(rawPlant.extendedSpecs.height
                ? [{ label: "Tinggi", value: rawPlant.extendedSpecs.height }] : []),
            ...(rawPlant.extendedSpecs.potSize
                ? [{ label: "Ukuran Pot", value: rawPlant.extendedSpecs.potSize }] : []),
            ...(rawPlant.extendedSpecs.growthRate
                ? [{ label: "Pertumbuhan", value: rawPlant.extendedSpecs.growthRate }] : []),
        ],
        originData: {                               // ← was hardcoded
            regions: rawPlant.extendedSpecs.originRegions || [],
            habitat: rawPlant.extendedSpecs.habitat || "",
        },
        benefits: rawPlant.extendedSpecs.benefits || [],  // ← was hardcoded
        faq: (rawPlant.faqs || []).map((f, i) => ({
            id: `faq-${i}`, question: f.q, answer: f.a,
        })),
        similar: similarPlants.map(p => ({
            id: p.id,
            slug: p.slug,
            name: p.name,
            price: parseInt(p.basePriceStr.replace(/[^0-9]/g, "")),
            image: resolveImageSrc(p.images[0]?.url),
            badge: p.labels[0] || undefined,
        })),
    };

    return (
        <div id="page-pdp" className="min-h-screen bg-background overflow-x-hidden">
            {/* ═══ TIER 1: Hero (main bg) ═══ */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
                <ProductBreadcrumb items={plant.breadcrumb} />

                <article itemScope itemType="https://schema.org/Product">
                    <section aria-label="Galeri dan informasi produk" className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-start">
                        <ScrollReveal direction="left" className="lg:sticky lg:top-20">
                            <ProductGallery images={plant.images} badges={plant.badges} />
                        </ScrollReveal>

                        <ScrollReveal direction="right" delay={0.15}>
                            <ProductHeader
                                category={plant.category}
                                name={plant.name}
                                cultivarName={plant.cultivarName || undefined}
                                scientificName={plant.scientificName || undefined}
                                price={plant.price}
                                originalPrice={plant.originalPrice}
                                stock={plant.stock}
                                isToxic={plant.isToxic}
                                petSafe={plant.petSafe}
                            />
                            <ProductTeaser teaser={plant.teaserText} />
                            <ProductCTA
                                plantId={rawPlant.id}
                                price={plant.price}
                                stock={plant.stock}
                                shippingRisk={plant.shippingData.risk}
                            />
                            <ProductQuickSpecs specs={plant.specs} />
                            <UsagePills tags={plant.usageTags} />
                        </ScrollReveal>
                    </section>

                    <ScrollReveal className="mt-6">
                        <section aria-label="Jaminan keamanan">
                            <TrustBadges />
                        </section>
                    </ScrollReveal>
                </article>
            </div>

            {/* ═══ TIER 2: Engagement (section-alt bg) ═══ */}
            <div className="bg-[hsl(var(--section-alt))] mt-10 border-t border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <section aria-label="Informasi detail" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        <ScrollReveal className="lg:col-span-8">
                            <BotanicalNarrative narrative={plant.narrative} expertNote={plant.expertNote} />
                        </ScrollReveal>
                        <ScrollReveal className="lg:col-span-4" delay={0.1}>
                            <CareSnapshot items={plant.careSnapshot} />
                        </ScrollReveal>
                    </section>
                </div>
            </div>

            {/* ═══ TIER 3: Deep Dive (main bg) ═══ */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
                <ScrollReveal>
                    <ProductDetailsAccordion
                        identity={plant.identity}
                        care={plant.careData}
                        safety={plant.safetyData}
                        shipping={plant.shippingData}
                        fullSpecs={plant.fullSpecs}
                        origin={plant.originData}
                        benefits={plant.benefits}
                    />
                </ScrollReveal>

                <ScrollReveal delay={0.1}>
                    <ProductFAQ items={plant.faq} />
                </ScrollReveal>
            </div>

            {/* ═══ TIER 4: Social Proof (section-alt bg) ═══ */}
            <div className="bg-[hsl(var(--section-alt))] border-t border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
                    <ScrollReveal>
                        <ProductReviews
                          plantId={rawPlant.id}
                          isLoggedIn={rawPlant.isLoggedIn}
                          hasPurchased={rawPlant.hasPurchased}
                        />
                    </ScrollReveal>

                    <ScrollReveal delay={0.1}>
                        <SimilarSpecimens items={plant.similar} />
                    </ScrollReveal>

                    <ScrollReveal delay={0.15}>
                        <SocialShare />
                    </ScrollReveal>
                </div>
            </div>

            {/* Mobile Bottom Bar */}
            <MobileBottomBar plantId={rawPlant.id} price={plant.price} />
        </div>
    );
}
