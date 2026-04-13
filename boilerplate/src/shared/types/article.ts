// ============================================
// Knowledge Article Types
// ============================================
// Shared types used by article components.

export type ArticleSpec = {
    icon: string;
    label: string;
    value: string;
};

export type ArticleExpert = {
    name: string;
    shortName: string;
    title: string;
    avatar: string;
    bio: string;
    badge: string;
    verificationNote: string;
};

export type RelatedArticle = {
    slug: string;
    category: string | null;
    title: string;
    heroImage: string | null;
    heroImageAlt: string | null;
};

export type ArticleDetail = {
    slug: string;
    title: string;
    subtitle: string;
    heroImage: string;
    heroImageAlt: string;
    author: string;
    date: string;
    readTime: string;
    category: string;
    content: string;
    specs: ArticleSpec[];
    expert: ArticleExpert;
    relatedArticles: RelatedArticle[];
    mobileSpecimenImage: string;
    mobileSpecimenLabel: string;
};
