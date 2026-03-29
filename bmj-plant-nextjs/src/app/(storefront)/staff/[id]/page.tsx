// src/app/(storefront)/staff/[id]/page.tsx — Server Component
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getStaffProfileById } from "@/lib/data/staff-profiles";

type Props = {
    params: Promise<{ id: string }>;
};

/** Dynamic SEO metadata — per Next.js generateMetadata best practice */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const profile = await getStaffProfileById(id);

    if (!profile) {
        return { title: "Staff Tidak Ditemukan" };
    }

    const name = profile.shortName || profile.user?.name || "Staff BMJ";
    return {
        title: `${name} — ${profile.title}`,
        description: profile.bio
            ? `${profile.bio.substring(0, 160)}`
            : `Profil ${name}, ${profile.title} di BMJ Plant Store.`,
        alternates: {
            canonical: `/staff/${id}`,
        },
        openGraph: {
            title: `${name} — ${profile.title} | BMJ Plant Store`,
            description: profile.bio
                ? profile.bio.substring(0, 200)
                : `Profil ${name}, ${profile.title}.`,
            url: `/staff/${id}`,
        },
    };
}

export default async function StaffProfilePage({ params }: Props) {
    const { id } = await params;
    const profile = await getStaffProfileById(id);

    if (!profile) {
        notFound();
    }

    const displayName = profile.shortName || profile.user?.name || "Staff BMJ";
    const initials = displayName
        .split(/\s+/)
        .map(w => w.replace(/\./g, "")[0]?.toUpperCase() ?? "")
        .slice(0, 2)
        .join("");

    return (
        <div className="container-page py-12 md:py-20">
            <div className="max-w-3xl mx-auto">
                {/* Profile Header */}
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-10">
                    {/* Avatar */}
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shrink-0">
                        {profile.avatar ? (
                            <Image
                                src={profile.avatar}
                                alt={displayName}
                                width={160}
                                height={160}
                                className="object-cover w-full h-full"
                            />
                        ) : (
                            <span className="text-5xl md:text-6xl font-serif font-bold text-white/90 select-none">
                                {initials}
                            </span>
                        )}
                    </div>

                    {/* Name & Title */}
                    <div className="text-center md:text-left">
                        <h1 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-1">
                            {displayName}
                        </h1>
                        <p className="text-primary font-semibold text-sm md:text-base mb-2">
                            {profile.title}
                        </p>
                        <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                            {profile.badge && (
                                <span className="inline-block px-3 py-1 bg-accent/10 border border-accent/30 text-accent rounded-full text-xs font-bold uppercase tracking-wider">
                                    {profile.badge}
                                </span>
                            )}
                            {profile.staffRole && (
                                <span className="inline-block px-3 py-1 bg-muted border border-border text-muted-foreground rounded-full text-xs font-medium">
                                    {profile.staffRole}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Bio */}
                {profile.bio && (
                    <div className="mb-10">
                        <h2 className="text-lg font-serif font-semibold text-foreground mb-3">Tentang</h2>
                        <p className="text-muted-foreground leading-relaxed">{profile.bio}</p>
                    </div>
                )}

                {/* Articles */}
                {profile.articles && profile.articles.length > 0 && (
                    <div className="mb-10">
                        <h2 className="text-lg font-serif font-semibold text-foreground mb-4">
                            Artikel Terbaru
                        </h2>
                        <div className="space-y-3">
                            {profile.articles.map((article) => (
                                <Link
                                    key={article.slug}
                                    href={`/knowledge/${article.slug}`}
                                    className="block p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="material-symbols-outlined text-primary text-lg">article</span>
                                        <div>
                                            <h3 className="font-medium text-foreground text-sm">
                                                {article.title}
                                            </h3>
                                            {article.category && (
                                                <p className="text-xs text-muted-foreground mt-0.5">
                                                    {article.category}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Curated Products */}
                {profile.curatedProducts && profile.curatedProducts.length > 0 && (
                    <div className="mb-10">
                        <h2 className="text-lg font-serif font-semibold text-foreground mb-4">
                            Produk Kurasi
                        </h2>
                        <div className="space-y-3">
                            {profile.curatedProducts.map((product) => (
                                <Link
                                    key={product.slug}
                                    href={`/product/${product.slug}`}
                                    className="block p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="material-symbols-outlined text-accent text-lg">eco</span>
                                        <h3 className="font-medium text-foreground text-sm">
                                            {product.name}
                                        </h3>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Back link */}
                <div className="pt-6 border-t border-border">
                    <Link
                        href="/overview#tim"
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                        <span className="material-symbols-outlined text-lg">arrow_back</span>
                        Kembali ke Tim Kami
                    </Link>
                </div>
            </div>
        </div>
    );
}
