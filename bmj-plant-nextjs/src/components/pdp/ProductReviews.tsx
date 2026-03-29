"use client";

import MaterialIcon from "./MaterialIcon";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Image from "next/image";
import ReviewForm from "@/components/pdp/ReviewForm";

interface ReviewData {
    name: string;
    date: string;
    rating: number;
    text: string;
    helpful: number;
    verified: boolean;
    avatar: string;
    photos?: string[];
}

interface RatingDistribution {
    stars: number;
    count: number;
}

interface ProductReviewsProps {
    plantId: string;
    isLoggedIn?: boolean;
    hasPurchased?: boolean;
    reviews?: ReviewData[];
    avgRating?: number;
    totalReviews?: number;
    distribution?: RatingDistribution[];
}



function StarRow({ count, size = 16 }: { count: number; size?: number }) {
    return (
        <div className="flex gap-0.5" aria-hidden="true">
            {[...Array(5)].map((_, i) => (
                <MaterialIcon key={i} name="star" filled={i < count} className={i < count ? "text-accent" : "text-border"} size={size} />
            ))}
        </div>
    );
}

export default function ProductReviews({ plantId, isLoggedIn, hasPurchased, reviews, avgRating, totalReviews, distribution }: ProductReviewsProps) {
    const [helpfulClicked, setHelpfulClicked] = useState<Set<number>>(new Set());
    const displayReviews = reviews || [];
    const displayAvg = avgRating || 0;
    const displayTotal = totalReviews || 0;
    const displayDist = distribution || [];

    const toggleHelpful = (idx: number) => {
        setHelpfulClicked((prev) => {
            const next = new Set(prev);
            if (next.has(idx)) next.delete(idx); else next.add(idx);
            return next;
        });
    };

    return (
        <div>
            {/* Section heading */}
            <div className="mb-4 flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/15 border border-accent/25 flex items-center justify-center shrink-0 mt-0.5">
                    <MaterialIcon name="star" filled className="text-accent" size={20} />
                </div>
                <div>
                    <span className="text-[10px] font-bold tracking-[0.2em] text-accent uppercase flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                        Social Proof
                    </span>
                    <h2 className="font-serif text-2xl font-bold text-foreground mt-0.5">Ulasan Pelanggan</h2>
                </div>
            </div>

            <section className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm relative" aria-label="Ulasan pelanggan">
                <div className="h-1 bg-gradient-to-r from-accent via-primary/40 to-transparent" />

                {/* Rating Summary */}
                <header className="p-6 pb-0">
                    <div className="flex items-start justify-between mb-5">
                        <div className="flex items-center gap-4">
                            <div className="relative text-center shrink-0 bg-accent/5 rounded-xl px-5 py-3 border border-accent/15 overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-primary/5 pointer-events-none" />
                                <p className="font-serif text-4xl font-bold text-foreground leading-none relative">{displayAvg}</p>
                                <StarRow count={Math.round(displayAvg)} size={14} />
                                <p className="text-[10px] text-muted-foreground mt-1 font-semibold uppercase tracking-wider relative">{displayTotal} ulasan</p>
                            </div>
                        </div>
                        <Button variant="outline" size="sm" className="gap-1.5 text-xs rounded-xl border-accent/30 text-accent hover:bg-accent hover:text-accent-foreground hover:border-accent">
                            <MaterialIcon name="rate_review" size={14} />
                            Tulis Ulasan
                        </Button>
                    </div>

                    {/* Distribution Bars */}
                    <div className="space-y-1.5 pb-6 border-b border-border">
                        {displayDist.map(({ stars, count }) => {
                            const pct = displayTotal > 0 ? (count / displayTotal) * 100 : 0;
                            return (
                                <div key={stars} className="flex items-center gap-2.5">
                                    <span className="text-[11px] text-foreground font-bold w-3 text-right shrink-0">{stars}</span>
                                    <MaterialIcon name="star" filled size={11} className="text-accent shrink-0" />
                                    <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                                        <div className="h-full rounded-full bg-gradient-to-r from-accent to-primary/60 transition-all" style={{ width: `${pct}%` }} />
                                    </div>
                                    <span className="text-[11px] text-muted-foreground w-5 shrink-0">{count}</span>
                                </div>
                            );
                        })}
                    </div>
                </header>

                {displayReviews.length > 0 ? (
                <div className="divide-y divide-border">
                    {displayReviews.map((review, idx) => (
                        <article key={idx} className="p-6 hover:bg-secondary/30 transition-colors">
                            <header className="flex items-start justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[11px] font-bold shrink-0 tracking-wide ring-2 ring-primary/20">
                                        {review.avatar}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="text-[13px] font-bold text-foreground">{review.name}</p>
                                            {review.verified && (
                                                <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase tracking-wider border border-primary/15">
                                                    <MaterialIcon name="verified" filled size={9} />
                                                    Verified
                                                </span>
                                            )}
                                        </div>
                                        <time className="text-[10px] text-muted-foreground/60 uppercase tracking-wider">{review.date}</time>
                                    </div>
                                </div>
                                <StarRow count={review.rating} size={14} />
                            </header>
                            <p className="text-[13px] text-foreground/65 leading-[1.7] mt-3">{review.text}</p>
                            {review.photos && review.photos.length > 0 && (
                              <div className="flex gap-2 mt-3 flex-wrap">
                                {review.photos.map((photoUrl, photoIdx) => (
                                  <div key={photoIdx} className="w-16 h-16 rounded-lg overflow-hidden border border-border">
                                    <Image src={photoUrl} alt={`Review foto ${photoIdx + 1}`} width={64} height={64} className="object-cover w-full h-full" />
                                  </div>
                                ))}
                              </div>
                            )}
                            <footer className="mt-3 flex items-center gap-3">
                                <button
                                    onClick={() => toggleHelpful(idx)}
                                    className={`flex items-center gap-1.5 text-[11px] font-bold transition-colors px-3 py-1.5 rounded-full border ${helpfulClicked.has(idx) ? "text-primary bg-primary/10 border-primary/20" : "text-muted-foreground border-transparent hover:text-foreground hover:bg-secondary hover:border-border"}`}
                                    aria-label={`Tandai membantu`}
                                >
                                    <MaterialIcon name="thumb_up" size={13} filled={helpfulClicked.has(idx)} />
                                    Membantu ({review.helpful + (helpfulClicked.has(idx) ? 1 : 0)})
                                </button>
                                <button className="text-[11px] text-muted-foreground/50 hover:text-foreground transition-colors flex items-center gap-1 px-2 py-1.5 rounded-full hover:bg-secondary">
                                    <MaterialIcon name="flag" size={12} />
                                    Laporkan
                                </button>
                            </footer>
                        </article>
                    ))}
                </div>
                ) : (
                <div className="p-8 text-center">
                    <MaterialIcon name="rate_review" size={40} className="text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-sm font-medium text-muted-foreground">Belum ada ulasan untuk produk ini</p>
                    <p className="text-xs text-muted-foreground/60 mt-1">Jadilah yang pertama memberikan ulasan!</p>
                </div>
                )}

                <footer className="px-6 py-4 border-t border-border bg-secondary/30 text-center">
                    <button className="text-[13px] font-bold text-primary hover:underline inline-flex items-center gap-1.5">
                        Lihat Semua {displayTotal} Ulasan
                        <MaterialIcon name="arrow_forward" size={16} />
                    </button>
                </footer>

                {/* Review Form */}
                <div className="p-6 border-t border-border">
                  <ReviewForm
                    plantId={plantId}
                    isLoggedIn={isLoggedIn ?? false}
                    hasPurchased={hasPurchased ?? false}
                  />
                </div>

                <div className="absolute bottom-3 right-3 opacity-[0.03] pointer-events-none">
                    <MaterialIcon name="reviews" size={72} className="text-accent" />
                </div>
            </section>
        </div>
    );
}
