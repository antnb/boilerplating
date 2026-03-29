import Link from "next/link";
import Image from "next/image";
import MaterialIcon from "./MaterialIcon";
import { resolveImageSrc } from "@/lib/utils/image";
import type { SimilarPlant } from "@/types/pdp";

type SimilarSpecimensProps = {
    items: SimilarPlant[];
};

function formatIDR(amount: number): string {
    return new Intl.NumberFormat("id-ID", { style: "decimal", minimumFractionDigits: 0 }).format(amount);
}

export default function SimilarSpecimens({ items }: SimilarSpecimensProps) {
    if (items.length === 0) return null;

    return (
        <div>
            <div className="mb-4 flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                    <MaterialIcon name="explore" className="text-primary" size={20} />
                </div>
                <div>
                    <span className="text-[10px] font-bold tracking-[0.2em] text-primary uppercase flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                        Rekomendasi
                    </span>
                    <h2 className="font-serif text-2xl font-bold text-foreground mt-0.5">Tanaman Serupa</h2>
                </div>
            </div>

            <section className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm relative" aria-label="Tanaman serupa">
                <div className="h-1 bg-gradient-to-r from-primary via-accent/40 to-transparent" />
                <div className="p-6">
                    <ul className="grid grid-cols-2 lg:grid-cols-4 gap-3 list-none p-0 m-0">
                        {items.slice(0, 4).map((product, idx) => (
                            <li key={product.slug}>
                                <Link href={`/product/${product.slug}`} className="group block bg-background rounded-xl overflow-hidden border border-border hover:border-primary/30 hover:shadow-md transition-all duration-200">
                                    <figure className="aspect-square relative overflow-hidden m-0">
                                        <Image
                                            src={resolveImageSrc(product.image)}
                                            alt={product.name}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                            sizes="(max-width: 1024px) 50vw, 25vw"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                        {product.badge && (
                                            <figcaption className={`absolute top-2 left-2 text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest shadow-sm ${idx % 2 === 0 ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground"}`}>
                                                {product.badge}
                                            </figcaption>
                                        )}
                                    </figure>
                                    <div className="p-3">
                                        <h3 className="text-[11px] text-muted-foreground truncate">{product.name}</h3>
                                        <p className="text-[13px] font-bold text-foreground mt-0.5 font-serif">IDR {formatIDR(product.price)}</p>
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <div className="text-center mt-4">
                        <Link href="/product" className="text-[12px] font-bold text-primary hover:underline inline-flex items-center gap-1 uppercase tracking-wider">
                            Lihat Semua <MaterialIcon name="arrow_forward" size={14} />
                        </Link>
                    </div>
                </div>
                <div className="absolute bottom-3 right-3 opacity-[0.03] pointer-events-none">
                    <MaterialIcon name="yard" size={72} className="text-primary" />
                </div>
            </section>
        </div>
    );
}
