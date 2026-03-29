"use client";

/* Section 12: Newsletter */

import { useState } from "react";
import type { NewsletterSectionData } from "@/lib/schemas/homepage-sections";

type Props = {
    data: NewsletterSectionData;
};

export function NewsletterSection({ data }: Props) {
    const [email, setEmail] = useState("");

    return (
        <section id="newsletter-section">
            <div className="bento-card bg-brand-off-white rounded-2xl p-6 md:p-8 lg:p-16 border border-brand-dark text-center flex flex-col items-center">
                <span className="material-icons text-brand-dark/20 text-3xl md:text-4xl mb-3 md:mb-4">
                    mail_outline
                </span>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif text-brand-dark mb-3 md:mb-4">
                    {data.heading}{" "}
                    <span className="italic text-brand-accent">
                        {data.headingHighlight}
                    </span>
                </h2>
                <p className="text-brand-dark/70 max-w-lg mb-6 md:mb-8 text-sm md:text-base">
                    {data.description}
                </p>
                <form className="w-full max-w-md flex flex-col sm:flex-row gap-3">
                    <input
                        className="flex-1 bg-white border border-brand-dark/20 rounded-full px-5 md:px-6 py-2.5 md:py-3 text-brand-dark text-sm focus:ring-1 focus:ring-brand-accent focus:border-brand-accent outline-none"
                        placeholder={data.placeholder}
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="bg-brand-dark text-white font-bold px-6 md:px-8 py-2.5 md:py-3 rounded-full hover:bg-brand-dark/90 transition-colors shadow-lg text-sm"
                    >
                        {data.ctaText}
                    </button>
                </form>
                <p className="text-2xs md:text-xs text-brand-dark/60 mt-3 md:mt-4">
                    {data.disclaimer}
                </p>
            </div>
        </section>
    );
}
