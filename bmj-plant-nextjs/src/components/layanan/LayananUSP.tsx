/* Section 2: USP Cards — 3 key advantages
   Desktop: 3-col grid
   Mobile: vertical stack */

import type { LayananUSPData } from "@/lib/schemas/layanan-sections";

type Props = { data?: LayananUSPData };

const defaultCards = [
    { icon: "sell", title: "Langsung dari Petani", desc: "Harga tangan pertama tanpa markup berlapis — transaksi langsung dengan kelompok tani." },
    { icon: "warehouse", title: "Kapasitas Besar", desc: "Kapasitas suplai ribuan tanaman melalui jaringan ratusan petani mitra." },
    { icon: "public", title: "Pengiriman Nasional", desc: "Pengiriman aman ke seluruh wilayah Indonesia via logistik terpercaya." },
];

export function LayananUSP({ data }: Props) {
    const cards = data?.cards ?? defaultCards;

    return (
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {cards.map((card) => (
                <div
                    key={card.icon}
                    className="bg-white rounded-xl p-6 border border-brand-dark flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow"
                >
                    <div className="w-12 h-12 bg-brand-bg rounded-full flex items-center justify-center text-brand-dark shrink-0">
                        <span className="material-symbols-outlined text-2xl">
                            {card.icon}
                        </span>
                    </div>
                    <div>
                        <h2 className="font-serif font-bold text-lg text-brand-dark mb-1">
                            {card.title}
                        </h2>
                        <p className="text-sm text-brand-dark/70">
                            {card.desc}
                        </p>
                    </div>
                </div>
            ))}
        </section>
    );
}
