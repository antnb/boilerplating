import Link from "next/link";
import Image from "next/image";
/* Section 5: Galeri Spesimen — plant photo gallery
   Desktop: 4-col masonry grid (2 tall + 4 short)
   Mobile: 2x2 grid

   Photos are PLANTS being sold, NOT landscaping projects */

import type { LayananGaleriData } from "@/lib/schemas/layanan-sections";

type Props = { data?: LayananGaleriData };

const defaultItems = [
    { name: "Aroid", info: "Stok: 50+", tag: "Varigata", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCJJDMPmed-xPvcMhNayfWX3oUsoARf771oyTkye2xyzFdifpdK-NHjVi05Jy2cBS3hODKwF8eqxoOlvDrj0Ljd1rqa1KNBINOGfTzbVwqCXAJRFsP5qbymgkf6F8PkXf0HWl-Xv9L0q0XnAW9hXyuZx3pRYHGJc3D4mvwd55PsXGOmP-gtP1ddTwfL9SWnMMuRz77MXdrFSo1pR3mLCAtf90I4_9CNTUJYsGWl9Cvk_BGKL4lVIVjVFGdUskjUlNdqVC6os6B9tQs", span: "col-span-1 row-span-2" },
    { name: "Sikas", info: "Tinggi: 80-120cm", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDjzsqMjlAjnrFKQBRcN1MejCx-AKqKnlFCroch7d9XrVqyyQKwuZdf9YeMZqrlr_m-iFeAfaPEeZ1FlMgbXUwvduY5vTaqWA3LA7EUf27vcFfmzF44XDbR3cKxt7RVDj8JBBspzth4MGhRkbyQfxhpsLQAw5IMsJzvzDoGpzMSCpD3_oGcvKg1sFownt-ljJZKMLU3uczHvuN-rSIIeOE01htSWHZ8NTrCwJrnVrxFAYDmLza2JuLvwKhaOh8kOhFYpO32VhhzP5Y", span: "col-span-1 row-span-1" },
    { name: "Aglaonema", info: "Stok: 200+ pot", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCKxIlI7sYLKHXHB4JB0m0BDPGRiXnb6dNdCITDISfVadR3ZknoDL40q-R_SNQe74lr7tNFP7F9CI5T1WBT6-dHm7R7tp_Pil7itVvP9YhfSqr0Oa8xP-PJtZ2bsjplq6yld69tSPMdWOG85S9m8FQjozelGvrmcWsyB61LFBdl4ca4aiWrtBuR0UqtVINMvpAKqz08T6HFcA6_HpoqEpAt98HDT359nSiB-w9v_tNxbElXXIV3brruLC72lnhR5UxTzYq6Iw2O7bk", span: "col-span-1 row-span-1" },
    { name: "Palms", info: "3-5m", tag: "Project Grade", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC8m7SARRxYWix1sKa_ppCrfZiojz976VWxL5CFPZ_pe9OnztElQaymFkeYPCrqgHIcOrLAY7nGNdQgSAlPBZf-x8Bm9pQXT-Txu1D6lwj7WRLv5vyVuqdYAgLJmPhPJLGZmU_LxjYaAxiBjvk3ykU3BlrB_aCv-6QVXlOKDJSEsO29QzBcsDdYLWmiZkYCRjr-p7n23anBfM4MP2NfvcPqSLsTjOjiaswqHzHt33ZRI3PMv8wf-Jc5p_4GuzOoa4jj8PUgTf6iRfs", span: "col-span-1 row-span-2" },
    { name: "Bonsai", info: "Usia: 15+ Tahun", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDIHUO7E4i8QO_ak9Ctv1saKMuW5bqnpt7WwRuCTNpcmFMVr2bMqi-TYNENpTtEg8Cr3b4uBk0pPCR3_gdYGVePVrNKnt5eIQDvgNSVxRJrtNjuh78x_6Z4Fpsx6b3GVhAQU_SFpvkQhzcraG1lDtKpgP2rR8UU11qD437WvVnYtsqeaYaA5myOer96C5om0nrOaDJu0UfQZ1ql8mOaWVBUNhsknYTX6_p1CGPJR0vFSKOAigXH9lzuyTbSfWILoWgtZPzm1d11zBQ", span: "col-span-1 row-span-1" },
    { name: "Indoor", info: "Low Maintenance", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAJjNcWE8Szy3a04FUi2F2K8vl_gjBhVXBTP1Lx-wr0d_t74V6m3Vazysb6_IS-CE26i4LNNfmEa_RPiFZz8_GE0r44SMVkGEVz6pey9_nGfOuUwmqhUEmmVNJc-prr76-lJREHRBsmWO2srsYCtxEIPaxYCuqOt7Y3D8dFa-NSb1cVpQQNA1sop_NnToROVKv-0q5f_nM9sfTYGRx-TODPCzNYR9tLBSqUwC_XTo1dNi7jm5TiL0fjoOkFzsOksOSZ9MUiWzz9WM8", span: "col-span-1 row-span-1" },
];

export function LayananGaleri({ data }: Props) {
    const sectionTitle = data?.sectionTitle ?? "Galeri Spesimen";
    const ctaText = data?.ctaText ?? "Lihat Semua";
    const ctaHref = data?.ctaHref ?? "/product";
    const galleryItems = data?.items ?? defaultItems;

    return (
        <section className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-serif font-bold text-brand-dark">
                    {sectionTitle}
                </h2>
                <Link href={ctaHref}
                    className="text-sm font-bold text-brand-dark underline decoration-brand-accent decoration-2 underline-offset-4 hover:text-brand-dark/70"
                >
                    {ctaText}
                </Link>
            </div>

            {/* Desktop: masonry grid */}
            <div className="hidden md:grid grid-cols-4 gap-4 auto-rows-[200px]">
                {galleryItems.map((item) => (
                    <div
                        key={item.name}
                        className={`${item.span} rounded-xl overflow-hidden border border-brand-dark relative group`}
                    >
                        <Image
                            alt={item.name}
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                            src={item.image}
                            fill
                            sizes="25vw"
                        />
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                            <span className="text-white font-serif font-bold block">
                                {item.name}
                            </span>
                            <div className="flex items-center gap-2 mt-1">
                                {item.tag && (
                                    <span className="text-white/90 text-2xs bg-brand-accent/20 px-1.5 py-0.5 rounded border border-white/10 backdrop-blur-sm">
                                        {item.tag}
                                    </span>
                                )}
                                <span className="text-white/70 text-xs">
                                    {item.info}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Mobile: 2x2 grid (first 4 items only) */}
            <div className="grid md:hidden grid-cols-2 gap-3">
                {galleryItems.slice(0, 4).map((item) => (
                    <div
                        key={item.name}
                        className="relative rounded-[16px] overflow-hidden aspect-[4/5] shadow-sm"
                    >
                        <Image
                            alt={item.name}
                            className="object-cover"
                            src={item.image}
                            fill
                            sizes="50vw"
                        />
                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-3 pt-8">
                            <span className="text-white text-sm font-bold block">
                                {item.name}
                            </span>
                            <span className="text-white/80 text-2xs">
                                {item.info}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
