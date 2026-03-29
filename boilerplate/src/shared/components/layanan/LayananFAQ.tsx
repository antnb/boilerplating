/* Section 9: FAQ — common purchase questions
   Desktop: 2-col grid of accordions
   Mobile: single column stack

   Uses native <details> for zero-JS accordion */

import type { LayananFAQData } from "@/shared/lib/schemas/layanan-sections";

type Props = { data?: LayananFAQData };

const defaultItems = [
    { q: "Apakah ada garansi tanaman mati?", a: 'Ya, kami memberikan garansi 100% "Death on Arrival". Jika tanaman diterima dalam kondisi mati atau rusak parah, kami ganti baru atau refund penuh.' },
    { q: "Berapa minimum order grosir?", a: "Untuk tanaman proyek grosir, minimum order mulai dari 10.000 pohon. Untuk tanaman exotic retail, bisa dibeli satuan." },
    { q: "Apakah ada diskon partai besar?", a: "Tentu. Kami menawarkan tier diskon khusus untuk pembelian volume tinggi atau kontrak suplai rutin. Hubungi tim sales untuk penawaran." },
    { q: "Berapa lama pengiriman?", a: "1-2 hari proses karantina dan treatment akar, ditambah waktu ekspedisi reguler 2-4 hari tergantung lokasi tujuan Anda." },
    { q: "Apakah bisa kirim ke luar Jawa?", a: "Ya, kami melayani pengiriman ke seluruh Indonesia — Sumatera, Kalimantan, Sulawesi, Bali, dan lainnya — via logistik pihak ketiga dengan surat karantina resmi." },
];

export function LayananFAQ({ data }: Props) {
    const sectionTitle = data?.sectionTitle ?? "Pertanyaan Umum (FAQ)";
    const faqItems = data?.items ?? defaultItems;

    return (
        <section className="max-w-4xl mx-auto w-full py-8">
            <h2 className="text-2xl font-serif font-bold text-brand-dark text-center mb-8">
                {sectionTitle}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {faqItems.map((faq) => (
                    <details
                        key={faq.q}
                        className="group bg-white rounded-xl border border-brand-dark overflow-hidden h-fit"
                    >
                        <summary className="flex justify-between items-center font-medium cursor-pointer list-none p-5 text-brand-dark hover:bg-brand-bg transition-colors">
                            <span>{faq.q}</span>
                            <span className="transition group-open:rotate-180 ml-2 shrink-0">
                                <span className="material-icons">
                                    expand_more
                                </span>
                            </span>
                        </summary>
                        <div className="text-brand-dark/70 px-5 pb-5 pt-0 text-sm leading-relaxed">
                            {faq.a}
                        </div>
                    </details>
                ))}
            </div>
        </section>
    );
}
