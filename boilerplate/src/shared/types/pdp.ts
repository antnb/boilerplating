// ============================================
// PDP (Product Detail Page) Types
// ============================================
// Shared types used by PDP components.
// Previously lived in mock-pdp-data.ts.

export type PlantImage = {
    src: string;
    alt: string;
};

export type PlantSpec = {
    label: string;
    value: string;
};

export type CareItem = {
    icon: string;
    label: string;
    value: string;
    detail: string;
    color?: string;
};

export type FAQItem = {
    question: string;
    answer: string;
};

export type SimilarPlant = {
    id: string;
    name: string;
    price: number;
    image: string;
    slug: string;
    badge?: string;
};

export type ShippingStep = {
    step: number;
    title: string;
    description: string;
};

export type ToxicityInfo = {
    level: string;
    description: string;
    toxicParts: string[];
};

export type ExpertNote = {
    name: string;
    title: string;
    avatar: string;
    quote: string;
};

export type UsageTag = {
    icon: string;
    label: string;
};

export type PlantBadge = {
    label: string;
    icon: string;
    variant: "accent" | "dark";
};
