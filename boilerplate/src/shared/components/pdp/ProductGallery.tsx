"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogTitle } from "@/shared/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import MaterialIcon from "./MaterialIcon";
import type { PlantBadge } from "@/shared/types/pdp";

interface ProductGalleryProps {
    images: { src: string; alt: string; caption?: string }[];
    badges?: PlantBadge[];
}

export default function ProductGallery({ images, badges }: ProductGalleryProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [displayIndex, setDisplayIndex] = useState(0);
    const [lightboxOpen, setLightboxOpen] = useState(false);

    const changeTo = useCallback((newIndex: number) => {
        if (newIndex === displayIndex || isTransitioning) return;
        setIsTransitioning(true);
        setTimeout(() => {
            setDisplayIndex(newIndex);
            setActiveIndex(newIndex);
            setTimeout(() => setIsTransitioning(false), 50);
        }, 200);
    }, [displayIndex, isTransitioning]);

    const prev = () => changeTo(activeIndex === 0 ? images.length - 1 : activeIndex - 1);
    const next = () => changeTo(activeIndex === images.length - 1 ? 0 : activeIndex + 1);

    if (!images || images.length === 0) {
        return (
            <div className="aspect-square bg-secondary rounded-xl flex items-center justify-center">
                <span className="text-muted-foreground text-sm">Belum ada foto</span>
            </div>
        );
    }

    return (
        <figure className="space-y-3 m-0" itemProp="image" itemScope itemType="https://schema.org/ImageObject">
            {/* Main Image */}
            <div
                className="relative rounded-xl overflow-hidden bg-secondary aspect-square"
                role="group"
                aria-roledescription="Galeri foto"
                aria-label={`Foto ${activeIndex + 1} dari ${images.length}`}
            >
                <Image
                    src={images[displayIndex].src}
                    alt={images[displayIndex].alt}
                    fill
                    className={`object-cover cursor-zoom-in transition-all duration-300 ease-in-out ${isTransitioning ? "opacity-0 scale-[1.02]" : "opacity-100 scale-100"}`}
                    onClick={() => setLightboxOpen(true)}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={displayIndex === 0}
                    quality={85}
                    itemProp="contentUrl"
                />
                <meta itemProp="name" content="Product Image" />

                {/* FOTO ASLI Badge */}
                <figcaption className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5">
                    <MaterialIcon name="photo_camera" size={14} />
                    FOTO ASLI
                </figcaption>

                {/* Badges */}
                {badges && badges.length > 0 && (
                    <div className="absolute top-12 left-3 flex flex-col gap-1.5 z-10">
                        {badges.map((b, i) => (
                            <span key={i} className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1 ${b.variant === "accent" ? "bg-accent text-accent-foreground" : "bg-foreground text-background"}`}>
                                <MaterialIcon name={b.icon} size={12} />{b.label}
                            </span>
                        ))}
                    </div>
                )}

                {/* Navigation */}
                {images.length > 1 && (
                    <>
                        <button onClick={prev} aria-label="Foto sebelumnya" className="absolute left-3 top-1/2 -translate-y-1/2 bg-card/80 backdrop-blur-sm hover:bg-card rounded-full p-2 transition-colors">
                            <MaterialIcon name="chevron_left" className="text-foreground" size={18} />
                        </button>
                        <button onClick={next} aria-label="Foto berikutnya" className="absolute right-3 top-1/2 -translate-y-1/2 bg-card/80 backdrop-blur-sm hover:bg-card rounded-full p-2 transition-colors">
                            <MaterialIcon name="chevron_right" className="text-foreground" size={18} />
                        </button>
                    </>
                )}

                {/* Zoom */}
                <button onClick={() => setLightboxOpen(true)} aria-label="Perbesar foto" className="absolute bottom-3 left-3 bg-card/80 backdrop-blur-sm hover:bg-card rounded-full p-2 transition-colors">
                    <MaterialIcon name="zoom_in" className="text-foreground" size={18} />
                </button>

                {/* Counter */}
                {images.length > 1 && (
                    <output className="absolute bottom-3 right-3 bg-card/80 backdrop-blur-sm text-foreground text-xs font-medium px-3 py-1 rounded-full" aria-live="polite">
                        {activeIndex + 1}/{images.length}
                    </output>
                )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
                <nav className="flex gap-2" aria-label="Thumbnail foto produk">
                    {images.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => changeTo(idx)}
                            aria-label={`Lihat foto ${idx + 1}`}
                            aria-current={idx === activeIndex ? "true" : undefined}
                            className={`flex-1 aspect-square rounded-lg overflow-hidden border-2 transition-all ${idx === activeIndex ? "border-primary ring-1 ring-primary" : "border-transparent opacity-70 hover:opacity-100"}`}
                        >
                            <Image src={img.src} alt={img.alt} fill className="object-cover" sizes="120px" />
                        </button>
                    ))}
                </nav>
            )}

            {/* Lightbox */}
            <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
                <DialogContent className="max-w-[95vw] max-h-[95vh] w-auto h-auto p-0 border-none bg-transparent shadow-none [&>button]:hidden flex items-center justify-center">
                    <VisuallyHidden><DialogTitle>Foto produk</DialogTitle></VisuallyHidden>
                    <figure className="relative flex flex-col items-center justify-center m-0 w-full h-full">
                        <div className="relative" style={{ width: '90vw', height: '80vh', maxWidth: '1400px' }}>
                            <Image
                                src={images[displayIndex].src}
                                alt={images[displayIndex].alt}
                                fill
                                className="object-contain rounded-lg"
                                sizes="90vw"
                                quality={90}
                            />
                        </div>
                        <figcaption className="w-full max-w-[90vw] mt-3 px-4 py-3 rounded-xl text-center">
                            <p className="text-sm text-white/90 font-medium leading-relaxed">
                                {images[displayIndex].caption || images[displayIndex].alt}
                            </p>
                            <span className="text-[11px] text-white/50 mt-1 inline-block">
                                {activeIndex + 1} / {images.length}
                            </span>
                        </figcaption>
                        <button onClick={(e) => { e.stopPropagation(); prev(); }} aria-label="Foto sebelumnya" className="absolute left-2 top-[37.5%] -translate-y-1/2 bg-card/90 backdrop-blur-sm hover:bg-card rounded-full p-2.5 transition-colors">
                            <MaterialIcon name="chevron_left" className="text-foreground" size={24} />
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); next(); }} aria-label="Foto berikutnya" className="absolute right-2 top-[37.5%] -translate-y-1/2 bg-card/90 backdrop-blur-sm hover:bg-card rounded-full p-2.5 transition-colors">
                            <MaterialIcon name="chevron_right" className="text-foreground" size={24} />
                        </button>
                        <button onClick={() => setLightboxOpen(false)} aria-label="Tutup" className="absolute top-2 right-2 bg-card/90 backdrop-blur-sm hover:bg-card rounded-full p-2 transition-colors">
                            <MaterialIcon name="close" className="text-foreground" size={20} />
                        </button>
                    </figure>
                </DialogContent>
            </Dialog>
        </figure>
    );
}
