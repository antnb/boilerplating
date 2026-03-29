import Link from "next/link";
import Image from "next/image";
import type { LayananHeroData } from "@/lib/schemas/layanan-sections";
import nurseryMain from "@/assets/images/nursery-main.webp";

type Props = { data?: LayananHeroData };

export function LayananHero({ data }: Props) {
    const badgeIcon = data?.badgeIcon ?? "verified";
    const badgeText = data?.badgeText ?? "Kelompok Tani Cipanas";
    const headingLine1 = data?.headingLine1 ?? "SUPPLIER TANAMAN";
    const headingLine2 = data?.headingLine2 ?? "LANGSUNG DARI PETANI";
    const subtitle = data?.subtitle ?? "Kami menghubungkan Anda langsung dengan jaringan petani spesialis. Tanpa perantara berlapis, jaminan kualitas kurasi, dan harga tangan pertama.";

    return (
        <section id="hero" aria-label="Layanan Hero" style={{ minHeight: "auto" }}>
            {/* ── Background ── */}
            <div className="hero__bg" aria-hidden="true">
                <Image
                    src={nurseryMain}
                    alt="BMJ Nursery Cipanas"
                    fill
                    className="object-cover object-center"
                    priority
                    sizes="100vw"
                />
            </div>
            <div className="hero__overlay" />

            {/* ── Body ── */}
            <div className="hero__body" style={{ paddingBottom: 48 }}>
                <div className="hero__copy">
                    <div className="hero__copy-inner">
                        {/* Badge */}
                        <span className="hero__badge">
                            <span className="material-symbols-outlined hero__badge-icon">{badgeIcon}</span>
                            {badgeText}
                        </span>

                        {/* Heading */}
                        <h1 className="hero__heading">
                            <span className="hero__heading-mobile">
                                {headingLine1}<br />{headingLine2}
                            </span>
                            <span className="hero__heading-desktop">
                                {headingLine1} {headingLine2}
                            </span>
                        </h1>

                        {/* Description */}
                        <p className="hero__desc">{subtitle}</p>
                    </div>
                </div>

                {/* CTA Buttons */}
                <div className="hero__bottom">
                    <div className="hero__cta">
                        <Link href="/layanan#kontak" className="hero__btn-primary">
                            <span className="material-symbols-outlined hero__btn-icon">call</span>
                            Konsultasi Kebutuhan
                            <span className="material-symbols-outlined hero__btn-arrow">trending_flat</span>
                        </Link>
                        <Link href="/product" className="hero__btn-secondary">
                            Lihat Katalog
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
