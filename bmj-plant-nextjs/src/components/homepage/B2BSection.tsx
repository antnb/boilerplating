/* Section 7: B2B Partnership */

import Image from "next/image";
import type { B2BSectionData } from "@/lib/schemas/homepage-sections";
import gardenPathImport from "@/assets/images/garden-path.webp";

const gardenPath = (gardenPathImport as any).src || gardenPathImport;

type Props = { data?: B2BSectionData };

const defaultServices = [
    {
        icon: "domain",
        title: "Suplai Skala Besar",
        desc: "Kapasitas penyediaan ribuan tanaman untuk proyek properti, resort, dan commercial landscape.",
    },
    {
        icon: "verified",
        title: "Kualitas Ekspor",
        desc: "Standar tanaman premium yang memenuhi persyaratan phytosanitary internasional.",
    },
    {
        icon: "local_shipping",
        title: "Logistik Khusus",
        desc: "Armada pengiriman tanaman hidup berpendingin untuk memastikan tanaman tiba sehat.",
    },
    {
        icon: "handshake",
        title: "Harga Grosir",
        desc: "Penawaran harga terbaik untuk pembelian volume besar dan kontrak jangka panjang.",
    },
];

export function B2BSection({ data }: Props) {
    const badge = data?.badge ?? "Untuk Profesional";
    const heading = data?.heading ?? "Mitra Terpercaya";
    const headingHighlight = data?.headingHighlight ?? "Proyek Properti & Lanskap";
    const services = data?.services ?? defaultServices;
    const ctaText = data?.ctaText ?? "Konsultasi B2B via WA";
    const projectImage = data?.projectImage ?? gardenPath;
    const projectTitle = data?.projectTitle ?? "Resort Project, Bali";
    const projectSubtitle = data?.projectSubtitle ?? "Full Landscape Supply";
    const stats = data?.stats ?? [
        { value: "150+", label: "Proyek" },
        { value: "50+", label: "Mitra" },
    ];
    const partnersLabel = data?.partnersLabel ?? "Partner Proyek Kami";
    return (
        <section id="b2b-section" className="grid grid-cols-1 lg:grid-cols-2 min-h-[400px] md:min-h-[500px]">
            <div className="lg:col-span-2 bento-card bg-transparent rounded-2xl border border-brand-dark overflow-hidden">
                <div className="flex flex-col lg:flex-row">
                    {/* Left/Bottom: Content */}
                    <div className="w-full lg:w-1/2 p-5 md:p-8 lg:p-12 bg-brand-off-white flex flex-col justify-center border-t lg:border-t-0 lg:border-r border-brand-dark order-last lg:order-first">
                        <span className="inline-block mb-3 md:mb-4 w-fit px-3 md:px-4 py-1 bg-brand-dark/10 text-brand-dark text-2xs md:text-xs font-bold uppercase tracking-widest rounded-full">
                            {badge}
                        </span>
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif text-brand-dark mb-4 md:mb-6 leading-tight">
                            {heading} <br />
                            <span className="italic text-brand-dark/60">
                                {headingHighlight}
                            </span>
                        </h2>
                        {/* 2-col 2x2 grid on all devices to save vertical space and feel cohesive */}
                        <div className="grid grid-cols-2 b2b-services-grid mb-5 md:mb-8 gap-x-3 gap-y-4 md:gap-x-4 md:gap-y-6">
                            {services.map((svc) => (
                                <div key={svc.icon}>
                                    <span className="material-symbols-outlined text-brand-accent text-2xl md:text-3xl mb-1 block">
                                        {svc.icon}
                                    </span>
                                    <h3 className="font-bold text-brand-dark text-sm md:text-base mb-0.5 leading-tight">
                                        {svc.title}
                                    </h3>
                                    <p className="text-2xs md:text-sm text-brand-dark/70 leading-snug">
                                        {svc.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <button className="w-full sm:w-fit px-8 py-3 border border-brand-dark text-brand-dark text-sm font-bold rounded-full hover:bg-brand-dark hover:text-white transition-all flex items-center justify-center gap-2">
                            <span className="material-icons text-base">chat</span>
                            {ctaText}
                        </button>
                    </div>

                    {/* Right/Top: Image */}
                    <div className="w-full lg:w-1/2 relative h-[240px] sm:h-[400px] lg:h-auto overflow-hidden order-first lg:order-last">
                        <Image
                            alt="Landscape Project"
                            src={(projectImage as any).src || projectImage}
                            fill
                            className="object-cover"
                            sizes="(max-width: 1024px) 100vw, 50vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-transparent to-transparent" />
                        <div className="absolute bottom-0 w-full p-5 md:p-8">
                            <div className="flex flex-row items-end justify-between text-white gap-4">
                                <div>
                                    <p className="font-serif italic text-lg md:text-xl">
                                        {projectTitle}
                                    </p>
                                    <p className="text-2xs md:text-xs uppercase tracking-widest opacity-80 mt-1">
                                        {projectSubtitle}
                                    </p>
                                </div>
                                <div className="flex gap-4 sm:gap-6 text-right">
                                    {stats.map((stat, i) => (
                                        <div key={i} className="flex flex-col items-center">
                                            <h3 className="text-xl md:text-2xl font-serif text-brand-accent">
                                                {stat.value}
                                            </h3>
                                            <p className="text-3xs md:text-2xs uppercase tracking-wider font-medium opacity-80 mt-1">
                                                {stat.label}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom: Partner logos — visible on all devices */}
                <div className="border-t border-brand-dark/10 bg-brand-bg p-6 md:p-8 w-full">
                    <div className="flex flex-col gap-4">
                        <span className="text-2xs font-bold text-brand-dark/60 uppercase tracking-widest text-center">
                            {partnersLabel}
                        </span>
                        {/* Flex wrapping container for all devices */}
                        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-14 opacity-60 md:opacity-50 grayscale hover:opacity-100 transition-opacity duration-500">
                            {/* Inline SVG logos matching locked design */}
                            <svg className="h-6 md:h-8 w-auto" fill="currentColor" viewBox="0 0 100 25" xmlns="http://www.w3.org/2000/svg">
                                <rect height="20" rx="2" width="20" x="0" y="2" />
                                <rect height="15" rx="2" width="15" x="24" y="5" />
                                <rect height="10" rx="2" width="10" x="43" y="8" />
                                <text className="font-bold text-xs" fill="currentColor" fontFamily="sans-serif" x="60" y="16">CIPUTRA</text>
                            </svg>
                            <svg className="h-5 md:h-7 w-auto" fill="currentColor" viewBox="0 0 120 30" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10 5 L20 25 L30 5" fill="none" stroke="currentColor" strokeWidth="3" />
                                <text className="font-bold text-xs" fill="currentColor" fontFamily="sans-serif" x="40" y="20">PAKUWON</text>
                            </svg>
                            <svg className="h-6 md:h-8 w-auto" fill="currentColor" viewBox="0 0 120 30" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="15" cy="15" r="10" />
                                <text className="font-serif text-sm italic" fill="currentColor" fontFamily="serif" x="35" y="19">Marriott</text>
                            </svg>
                            <svg className="h-5 md:h-7 w-auto" fill="currentColor" viewBox="0 0 140 30" xmlns="http://www.w3.org/2000/svg">
                                <rect height="15" width="5" x="0" y="5" />
                                <rect height="15" width="5" x="8" y="5" />
                                <rect height="15" width="5" x="16" y="5" />
                                <text className="font-bold text-xs" fill="currentColor" fontFamily="sans-serif" x="30" y="18">PODOMORO</text>
                            </svg>
                            <svg className="h-5 md:h-7 w-auto" fill="currentColor" viewBox="0 0 140 30" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 15 L15 5 L25 15 L15 25 Z" fill="none" stroke="currentColor" strokeWidth="2" />
                                <text className="font-bold text-xs" fill="currentColor" fontFamily="sans-serif" x="35" y="18">SUMMARECON</text>
                            </svg>
                            <svg className="h-6 md:h-8 w-auto hidden sm:block" fill="currentColor" viewBox="0 0 120 30" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="15" cy="15" fill="none" r="8" stroke="currentColor" strokeWidth="2" />
                                <path d="M15 7 L15 23 M7 15 L23 15" stroke="currentColor" strokeWidth="2" />
                                <text className="font-bold text-xs" fill="currentColor" fontFamily="sans-serif" x="35" y="19">SINARMAS</text>
                            </svg>
                            <svg className="h-6 md:h-8 w-auto hidden sm:block" fill="currentColor" viewBox="0 0 120 30" xmlns="http://www.w3.org/2000/svg">
                                <rect fill="none" height="20" stroke="currentColor" strokeWidth="2" width="20" x="5" y="5" />
                                <text className="font-bold text-xs" fill="currentColor" fontFamily="sans-serif" x="35" y="19">JAYA</text>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
