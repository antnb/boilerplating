/* Section 6: Siapa Pelanggan Kami — customer personas
   Desktop: 3-col grid with dividers
   Mobile: vertical stack */

import type { LayananPelangganData } from "@/shared/lib/schemas/layanan-sections";

type Props = { data?: LayananPelangganData };

const defaultPersonas = [
    { icon: "storefront", title: "Toko Tanaman & Nursery", desc: "Reseller yang membutuhkan stok rutin berkualitas stabil dengan harga grosir.", solution: "Restok Mingguan & Konsinyasi" },
    { icon: "architecture", title: "Kontraktor & Arsitek", desc: "Pengadaan tanaman lanskap sesuai spesifikasi proyek dan RAB.", solution: "Penawaran Project & Faktur Pajak" },
    { icon: "potted_plant", title: "Kolektor Tanaman", desc: "Pencinta tanaman yang mencari spesies unik, varigata, dan langka.", solution: "Video Call Selection & Real-Pict" },
];

export function LayananPelanggan({ data }: Props) {
    const sectionTitle = data?.sectionTitle ?? "Siapa yang Kami Layani?";
    const personas = data?.personas ?? defaultPersonas;

    return (
        <section className="bg-brand-surface rounded-2xl p-8 border border-brand-dark">
            <h2 className="text-2xl font-serif font-bold text-brand-dark text-center mb-10">
                {sectionTitle}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-brand-dark/10">
                {personas.map((p) => (
                    <article
                        key={p.title}
                        className="flex flex-col items-center text-center px-4 pt-4 md:pt-0"
                    >
                        <span className="material-symbols-outlined text-4xl text-brand-dark mb-4">
                            {p.icon}
                        </span>
                        <h3 className="font-bold text-lg mb-2">{p.title}</h3>
                        <p className="text-sm text-brand-dark/70 mb-3">
                            {p.desc}
                        </p>
                        <p className="text-xs text-brand-dark/50 bg-brand-bg px-2 py-1 rounded">
                            Solusi: {p.solution}
                        </p>
                    </article>
                ))}
            </div>
        </section>
    );
}
