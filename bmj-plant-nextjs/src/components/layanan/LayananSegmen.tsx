import Link from "next/link";
import Image from "next/image";
/* Section 4: Dua Segmen Bisnis — 50/50 split
   Desktop: 2-col side-by-side image overlay cards
   Mobile: stacked vertical cards

   Important framing: BMJ SELLS plants, does NOT do landscaping projects */

import type { LayananSegmenData } from "@/lib/schemas/layanan-sections";

type Props = { data?: LayananSegmenData };

const defaultSegments = [
    {
        label: "Grosir", labelColor: "bg-brand-accent text-brand-dark",
        title: "Suplai Proyek", desc: "Solusi pengadaan tanaman skala besar untuk kontraktor, hotel, dan pengembang properti.",
        cta: "Lihat Katalog Grosir", href: "/product",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAIQ33E8YnJWlGyZgBOFJuN5jGmYObUlIk4nCjBaC8tQf-4OFWWeRLIGtEkzRSyE7dtIuxSrOG7Nh3RpTxIqmKq2r82P9HMnuNHWu1Nn3MMqyWS8u8ZPU5mZAFzcwqQMDtg6PGZXgr-ZSdTz_dVEZY4b9dYQ73XvmKOahbtWf6dWjxbr4xQlJlkP3OdiyJNFkiQQQD6Ce0z5hvq3Xdt7eLcDEKIwQNLUsjx2xDVLWtLAeZvXxZ6_iBJZ24YT-DLzWDR-bPivdiZv84",
    },
    {
        label: "Retail", labelColor: "bg-white text-brand-dark",
        title: "Koleksi Exotic", desc: "Spesimen langka dan tanaman hias premium untuk kolektor.",
        cta: "Lihat Koleksi Langka", href: "/product",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAb_JT-OMpbAARjw_I_adszrso-iPVZWlKbawSsOPZCqyY9B3xlQtv1n40kO5hAazielNI18ahoL9WaVfEJSp4C57SZ6yTN2l54qn2_PPwAp5hvJBlmbjlkNTUM_CPjdhWwS_5eE-RIYwzbZpkBlAgeVA1WTmt1W6cDFmadogdN87YfXsY_oRKA1I49yqNQAEysWkL5E2BJ_bV6Ry-odk5q4SXiKAr2rbFnGPmSo55kdZIT3OtqK-2WlCcEKLR_dVUxQrVUxfBvIH0",
    },
];

export function LayananSegmen({ data }: Props) {
    const segments = data?.segments ?? defaultSegments;

    return (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 md:h-[320px]">
            {segments.map((seg: any) => (
                <div
                    key={seg.title}
                    className="bento-card relative rounded-2xl overflow-hidden border border-brand-dark group cursor-pointer h-[240px] md:h-auto"
                >
                    {/* Background image */}
                    <Image
                        alt={seg.title}
                        className="object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                        src={(seg.image as any)?.src || seg.image}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-brand-dark/70 group-hover:bg-brand-dark/50 transition-colors" />

                    {/* Content overlay */}
                    <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-8">
                        <span
                            className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-sm mb-4 ${seg.labelColor || "bg-brand-accent text-brand-dark"}`}
                        >
                            {seg.label}
                        </span>
                        <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mb-2">
                            {seg.title}
                        </h2>
                        <p className="text-white/80 max-w-sm mb-6 text-sm md:text-base">
                            {seg.desc}
                        </p>
                        <Link href={seg.href || "/product"}
                            className="inline-flex items-center text-white font-bold border-b border-white pb-1 group-hover:border-brand-accent transition-colors text-sm"
                        >
                            {seg.cta || "Selengkapnya"}{" "}
                            <span className="material-icons text-sm ml-2">
                                arrow_forward
                            </span>
                        </Link>
                    </div>
                </div>
            ))}
        </section>
    );
}
