"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { Portal } from "@/components/ui/portal";
import { useOverlay } from "@/hooks/useOverlay";

type GalleryImage = {
    id: string;
    src: string;
    alt: string | null;
};

type ProjectGalleryProps = {
    images: GalleryImage[];
};

function GalleryLightbox({ src, onClose }: { src: string; onClose: () => void }) {
    const stableClose = useCallback(() => onClose(), [onClose]);
    useOverlay(true, stableClose);

    return (
        <Portal>
        <div
            className="fixed top-0 left-0 w-screen z-[100] bg-black/90 flex items-center justify-center p-4 cursor-pointer"
            style={{ height: '100dvh' }}
            onClick={onClose}
        >
            <button
                onClick={onClose}
                className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-10"
            >
                <span className="material-symbols-outlined text-3xl">close</span>
            </button>
            <img
                src={src}
                alt="Full view"
                className="max-w-full max-h-[85dvh] object-contain rounded-lg"
                onClick={(e) => e.stopPropagation()}
            />
        </div>
        </Portal>
    );
}

export default function ProjectGallery({ images }: ProjectGalleryProps) {
    const [selected, setSelected] = useState<string | null>(null);

    if (images.length === 0) return null;

    return (
        <section>
            <h2 className="font-serif text-xl md:text-2xl text-foreground mb-4 md:mb-6">Galeri Proyek</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
                {images.map((img, i) => (
                    <button
                        key={img.id}
                        onClick={() => setSelected(img.src)}
                        className={`group relative rounded-xl md:rounded-2xl overflow-hidden cursor-pointer ${
                            i === 0 ? "col-span-2 row-span-2 aspect-[4/3]" : "aspect-square"
                        }`}
                    >
                        <Image
                            src={img.src}
                            alt={img.alt || "Project image"}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            sizes="(max-width: 768px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                            <span className="material-symbols-outlined text-white text-2xl opacity-0 group-hover:opacity-100 transition-opacity">
                                zoom_in
                            </span>
                        </div>
                    </button>
                ))}
            </div>

            {selected && (
                <GalleryLightbox src={selected} onClose={() => setSelected(null)} />
            )}
        </section>
    );
}
