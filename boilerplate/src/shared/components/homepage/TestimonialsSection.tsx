"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { StaggerChildren } from "@/shared/components/layout/StaggerChildren";

type TestimonialItem = {
    id: string;
    name: string;
    company: string | null;
    avatar: string | null;
    rating: number;
    text: string;
    plant?: { name: string; slug: string } | null;
};

type Props = {
    testimonials: TestimonialItem[];
};

function Stars({ rating }: { rating: number }) {
    const full = Math.floor(rating);
    const hasHalf = rating % 1 !== 0;
    return (
        <div className="flex text-brand-accent">
            {Array.from({ length: full }).map((_, i) => (
                <span key={i} className="material-symbols-outlined text-xs md:text-sm">
                    star
                </span>
            ))}
            {hasHalf && (
                <span className="material-symbols-outlined text-xs md:text-sm">star_half</span>
            )}
        </div>
    );
}

function TestimonialCard({ t }: { t: TestimonialItem }) {
    const initials = t.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    return (
        <article className="bento-card break-inside-avoid bg-white rounded-xl md:rounded-2xl p-4 md:p-6 border border-brand-dark">
            <div className="flex items-start justify-between mb-3 md:mb-4">
                <div className="flex items-center gap-2 md:gap-3">
                    {t.avatar ? (
                        <Image
                            alt={t.name}
                            className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover"
                            src={t.avatar}
                            width={40}
                            height={40}
                        />
                    ) : (
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-brand-dark text-white flex items-center justify-center font-bold text-2xs md:text-xs">
                            {initials}
                        </div>
                    )}
                    <div>
                        <h4 className="font-bold text-brand-dark text-xs md:text-sm">
                            {t.name}
                        </h4>
                        <p className="text-2xs md:text-xs text-brand-dark/50">
                            {t.company}
                        </p>
                    </div>
                </div>
                <Stars rating={t.rating} />
            </div>
            <p className="text-xs md:text-sm text-brand-dark/80 leading-relaxed">
                {t.text}
            </p>
            {t.plant && (
                <p className="text-2xs text-brand-accent mt-2 italic">
                    Tentang: {t.plant.name}
                </p>
            )}
        </article>
    );
}

export function TestimonialsSection({ testimonials }: Props) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;
        const handleScroll = () => {
            const scrollLeft = el.scrollLeft;
            const cardWidth = el.firstElementChild
                ? (el.firstElementChild as HTMLElement).offsetWidth + 12
                : 1;
            setActiveIndex(Math.round(scrollLeft / cardWidth));
        };
        el.addEventListener("scroll", handleScroll, { passive: true });
        return () => el.removeEventListener("scroll", handleScroll);
    }, []);

    if (testimonials.length === 0) return null;

    return (
        <section id="testimonials-section">
            {/* Desktop: CSS columns masonry */}
            <StaggerChildren stagger={0.15} className="hidden md:block columns-1 md:columns-2 lg:columns-3 testimonials-masonry space-y-6">
                {testimonials.map((t) => (
                    <TestimonialCard key={t.id} t={t} />
                ))}
            </StaggerChildren>

            {/* Mobile: horizontal scroll with dots */}
            <div className="md:hidden">
                <div
                    ref={scrollRef}
                    className="flex gap-3 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4 -mx-1 px-1"
                >
                    {testimonials.map((t) => (
                        <div
                            key={t.id}
                            className="min-w-[280px] max-w-[300px] snap-center shrink-0"
                        >
                            <TestimonialCard t={t} />
                        </div>
                    ))}
                </div>
                {/* Dot indicators */}
                <div className="flex justify-center gap-1.5 mt-2">
                    {testimonials.map((_, i) => (
                        <div
                            key={i}
                            className={`w-1.5 h-1.5 rounded-full transition-colors ${i === activeIndex
                                ? "bg-brand-dark"
                                : "bg-brand-dark/20"
                                }`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
