"use client";

import { useState } from "react";
import type { OverviewFAQData } from "@/shared/lib/schemas/overview-sections";

type Props = { data?: OverviewFAQData };

interface FAQItem {
    question: string;
    answer: string;
}

const FAQ_ITEMS: FAQItem[] = [
    {
        question: "Berapa minimum order untuk pemesanan B2B?",
        answer: "Untuk pemesanan B2B/proyek, minimum order mulai dari 50 unit per varietas. Untuk retail, tidak ada minimum order. Kami fleksibel menyesuaikan kebutuhan proyek Anda.",
    },
    {
        question: "Berapa lama waktu pengiriman?",
        answer: "Estimasi pengiriman: Pulau Jawa 2-4 hari kerja, luar Jawa 5-7 hari kerja, Indonesia Timur 7-14 hari kerja. Untuk proyek besar, kami atur jadwal khusus sesuai kebutuhan.",
    },
    {
        question: "Apakah ada garansi tanaman?",
        answer: "Ya. Kami memberikan garansi 100% untuk kerusakan akibat pengiriman. Jika tanaman tiba dalam kondisi rusak, kami ganti unit baru atau refund penuh. Klaim berlaku 24 jam setelah barang diterima.",
    },
    {
        question: "Bagaimana proses pemesanan untuk proyek besar?",
        answer: "Hubungi tim kami via WhatsApp atau form RFQ. Kami akan: (1) Survey kebutuhan, (2) Kirim penawaran harga, (3) Siapkan sample jika diperlukan, (4) Atur jadwal pengiriman bertahap. Proses biasanya 3-5 hari kerja.",
    },
    {
        question: "Apa saja metode pembayaran yang diterima?",
        answer: "Kami menerima transfer bank (BCA, Mandiri, BNI, BRI), e-wallet (GoPay, OVO, Dana), dan untuk proyek B2B tersedia opsi termin pembayaran sesuai kesepakatan.",
    },
    {
        question: "Apakah BMJ menyediakan jasa landscaping?",
        answer: "BMJ fokus sebagai supplier tanaman. Namun, kami memiliki jaringan mitra kontraktor lanskap yang dapat kami referensikan. Kami juga menyediakan konsultasi pemilihan tanaman untuk proyek Anda.",
    },
];

export function OverviewFAQ({ data }: Props) {
    const badge = data?.badge ?? "FAQ";
    const heading = data?.heading ?? "Pertanyaan Umum";
    const subtitle = data?.subtitle ?? "Jawaban untuk pertanyaan yang sering ditanyakan oleh mitra bisnis kami.";
    const faqItems = (data?.items ?? FAQ_ITEMS) as FAQItem[];
    const [openIdx, setOpenIdx] = useState<number | null>(null);
    const toggle = (i: number) => setOpenIdx(openIdx === i ? null : i);

    const half = Math.ceil(faqItems.length / 2);
    const left = faqItems.slice(0, half);
    const right = faqItems.slice(half);

    const renderItem = (item: FAQItem, gIdx: number) => (
        <div key={gIdx} className="bg-card rounded-xl border border-border overflow-hidden">
            <button
                onClick={() => toggle(gIdx)}
                className="w-full flex items-center justify-between p-4 lg:p-5 text-left gap-3 hover:bg-muted/30 transition-colors"
                aria-expanded={openIdx === gIdx}
            >
                <span className="font-serif font-semibold text-foreground text-sm lg:text-base leading-snug">
                    {item.question}
                </span>
                <span
                    className={`material-symbols-outlined text-muted-foreground flex-shrink-0 transition-transform duration-300 ${openIdx === gIdx ? "rotate-180" : ""}`}
                >
                    expand_more
                </span>
            </button>
            <div
                className={`grid transition-all duration-300 ease-in-out ${openIdx === gIdx ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
            >
                <div className="overflow-hidden">
                    <div className="px-4 lg:px-5 pb-4 lg:pb-5">
                        <p className="text-muted-foreground text-sm leading-relaxed">{item.answer}</p>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <section id="faq" className="space-y-4 lg:space-y-6">
            <div className="text-center">
                <span className="inline-block px-3 py-1.5 bg-muted text-foreground rounded-full text-2xs lg:text-xs font-bold uppercase tracking-wider mb-3 lg:mb-4">
                    {badge}
                </span>
                <h2 className="text-xl lg:text-3xl font-serif font-bold text-foreground mb-2">
                    {heading}
                </h2>
                <p className="text-muted-foreground text-sm lg:text-base max-w-2xl mx-auto">
                    {subtitle}
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
                <div className="space-y-3 lg:space-y-4">{left.map((item, i) => renderItem(item, i))}</div>
                <div className="space-y-3 lg:space-y-4">{right.map((item, i) => renderItem(item, half + i))}</div>
            </div>
        </section>
    );
}
