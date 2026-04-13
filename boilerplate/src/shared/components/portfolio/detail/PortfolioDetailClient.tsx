"use client";

/**
 * PortfolioDetailClient — Client Component
 *
 * Contains ENTIRE render logic for Portfolio Detail page.
 * This page is too deeply embedded with framer-motion to split further.
 * Server Component only handles data lookup + metadata.
 *
 * Removed: useParams(), redirect(), getPortfolioDetail/getRelatedProjects calls.
 * Accepts: { project, relatedProjects } as serialized props from Server.
 */

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useCallback } from "react";
import type { DeliveryStage } from "@/shared/types/portfolio";
import ProjectGallery from "@/shared/components/portfolio/detail/ProjectGallery";
import { Portal } from "@/shared/components/ui/portal";
import { useOverlay } from "@/shared/hooks/useOverlay";

function StageLightbox({ src, onClose }: { src: string; onClose: () => void }) {
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
                    src={(src as any)?.src || src}
                    alt="Full view"
                    className="max-w-full max-h-[85dvh] object-contain rounded-lg"
                    onClick={(e) => e.stopPropagation()}
                />
            </div>
        </Portal>
    );
}

function DeliveryTimeline({ stages }: { stages: DeliveryStage[] }) {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    return (
        <section>
            <h2 className="font-serif text-xl md:text-2xl text-foreground mb-6">
                <span className="material-symbols-outlined text-primary align-middle mr-2">route</span>
                Tahapan Pengiriman
            </h2>

            <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-5 md:left-8 top-0 bottom-0 w-0.5 bg-border hidden sm:block" />

                <div className="space-y-6 md:space-y-8">
                    {stages.map((stage, i) => (
                        <motion.div
                            key={stage.step}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="relative"
                        >
                            {/* Timeline dot */}
                            <div className="hidden sm:flex absolute left-0 md:left-3 w-10 h-10 md:w-10 md:h-10 rounded-full bg-primary text-primary-foreground items-center justify-center z-10">
                                <span className="material-symbols-outlined text-lg">{stage.icon}</span>
                            </div>

                            {/* Content card */}
                            <div className="sm:ml-16 md:ml-20 p-4 md:p-6 rounded-2xl bg-muted/50 border border-border">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="sm:hidden w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                                        <span className="material-symbols-outlined text-sm">{stage.icon}</span>
                                    </span>
                                    <span className="text-xs font-bold text-primary uppercase tracking-wider">Step {stage.step}</span>
                                </div>
                                <h3 className="font-semibold text-foreground text-lg mb-2">{stage.label}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{stage.description}</p>

                                {/* Stage images */}
                                {stage.images.length > 0 && (
                                    <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
                                        {stage.images.map((img) => (
                                            <button
                                                key={img.id}
                                                onClick={() => setSelectedImage(img.src)}
                                                className="flex-shrink-0 relative w-32 h-24 md:w-40 md:h-28 rounded-xl overflow-hidden group cursor-pointer"
                                            >
                                                <Image
                                                    src={img.src}
                                                    alt={img.alt}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                    sizes="160px"
                                                />
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                                    <span className="material-symbols-outlined text-white text-xl opacity-0 group-hover:opacity-100 transition-opacity">
                                                        zoom_in
                                                    </span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {selectedImage && (
                <StageLightbox src={selectedImage} onClose={() => setSelectedImage(null)} />
            )}
        </section>
    );
}

interface PortfolioDetailClientProps {
    project: any;
    relatedProjects: any[];
}

export default function PortfolioDetailClient({ project, relatedProjects }: PortfolioDetailClientProps) {
    const resolvedRelated = relatedProjects.map(p => ({
        ...p,
        heroImage: (p.heroImage as any)?.src || p.heroImage
    }));

    const hasDeliveryStages = project.deliveryStages && project.deliveryStages.length > 0;

    return (
        <div className="min-h-screen pb-16">
            {/* Hero Section */}
            <section className="relative h-[50vh] md:h-[60vh] lg:h-[70vh] overflow-hidden">
                <Image
                    src={project.heroImage}
                    alt={project.title}
                    fill
                    className="object-cover"
                    priority
                    sizes="100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                {/* Back button */}
                <Link href="/portfolio"
                    className="absolute top-6 left-6 z-10 flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 hover:bg-white/20 transition-colors"
                >
                    <span className="material-symbols-outlined text-sm">arrow_back</span>
                    <span className="text-sm font-medium">Kembali</span>
                </Link>

                {/* Hero Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 lg:p-16">
                    <div className="container-page">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <span className="inline-block px-3 py-1 mb-4 bg-accent/90 text-accent-foreground text-xs font-bold uppercase tracking-wider rounded-full">
                                {project.category}
                            </span>
                            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white leading-tight max-w-3xl">
                                {project.title}
                            </h1>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <div className="container-page py-8 md:py-12 lg:py-16">
                <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
                    {/* Left: Content */}
                    <div className="lg:col-span-2 space-y-8 md:space-y-12">
                        {/* Description */}
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <h2 className="font-serif text-xl md:text-2xl text-foreground mb-4">Tentang Proyek</h2>
                            <p className="text-muted-foreground leading-relaxed">{project.description}</p>
                        </motion.section>

                        {/* Challenge, Solution, Result */}
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="grid sm:grid-cols-3 gap-6"
                        >
                            <div className="p-5 rounded-2xl bg-muted/50 border border-border">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="material-symbols-outlined text-accent">warning</span>
                                    <h3 className="font-semibold text-foreground">Tantangan</h3>
                                </div>
                                <p className="text-sm text-muted-foreground leading-relaxed">{project.challenge}</p>
                            </div>
                            <div className="p-5 rounded-2xl bg-muted/50 border border-border">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="material-symbols-outlined text-primary">lightbulb</span>
                                    <h3 className="font-semibold text-foreground">Solusi</h3>
                                </div>
                                <p className="text-sm text-muted-foreground leading-relaxed">{project.solution}</p>
                            </div>
                            <div className="p-5 rounded-2xl bg-muted/50 border border-border">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="material-symbols-outlined text-primary">check_circle</span>
                                    <h3 className="font-semibold text-foreground">Hasil</h3>
                                </div>
                                <p className="text-sm text-muted-foreground leading-relaxed">{project.result}</p>
                            </div>
                        </motion.section>

                        {/* Tags */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.35 }}
                            className="flex flex-wrap gap-2"
                        >
                            {project.tags.map((tag: string) => (
                                <span
                                    key={tag}
                                    className="px-3 py-1.5 bg-muted text-muted-foreground text-xs font-medium rounded-full"
                                >
                                    {tag}
                                </span>
                            ))}
                        </motion.div>

                        {/* Delivery Timeline (if applicable) */}
                        {hasDeliveryStages && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                <DeliveryTimeline stages={project.deliveryStages!} />
                            </motion.div>
                        )}

                        {/* Gallery */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: hasDeliveryStages ? 0.5 : 0.4 }}
                        >
                            <ProjectGallery images={project.gallery} />
                        </motion.div>
                    </div>

                    {/* Right: Specs Sidebar */}
                    <motion.aside
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="lg:sticky lg:top-24 h-fit"
                    >
                        <div className="p-6 rounded-2xl bg-card border border-border shadow-sm">
                            <h3 className="font-serif text-lg text-foreground mb-6">Detail Proyek</h3>
                            <dl className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <span className="material-symbols-outlined text-muted-foreground text-xl">business</span>
                                    <div>
                                        <dt className="text-xs text-muted-foreground uppercase tracking-wider">Klien</dt>
                                        <dd className="text-foreground font-medium">{project.specs.client}</dd>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="material-symbols-outlined text-muted-foreground text-xl">location_on</span>
                                    <div>
                                        <dt className="text-xs text-muted-foreground uppercase tracking-wider">Lokasi</dt>
                                        <dd className="text-foreground font-medium">{project.specs.location}</dd>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="material-symbols-outlined text-muted-foreground text-xl">forest</span>
                                    <div>
                                        <dt className="text-xs text-muted-foreground uppercase tracking-wider">Skala</dt>
                                        <dd className="text-foreground font-medium">{project.specs.scale}</dd>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="material-symbols-outlined text-muted-foreground text-xl">schedule</span>
                                    <div>
                                        <dt className="text-xs text-muted-foreground uppercase tracking-wider">Durasi</dt>
                                        <dd className="text-foreground font-medium">{project.specs.duration}</dd>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="material-symbols-outlined text-muted-foreground text-xl">event</span>
                                    <div>
                                        <dt className="text-xs text-muted-foreground uppercase tracking-wider">Selesai</dt>
                                        <dd className="text-foreground font-medium">{project.specs.completedAt}</dd>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="material-symbols-outlined text-muted-foreground text-xl">potted_plant</span>
                                    <div>
                                        <dt className="text-xs text-muted-foreground uppercase tracking-wider">Varietas</dt>
                                        <dd className="text-foreground font-medium">{project.specs.plantCount}</dd>
                                    </div>
                                </div>
                            </dl>

                            {/* CTA */}
                            <div className="mt-8 pt-6 border-t border-border">
                                <p className="text-sm text-muted-foreground mb-4">Tertarik dengan proyek serupa?</p>
                                <a
                                    href="https://wa.me/6281234567890"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 w-full py-3 bg-primary text-primary-foreground font-medium rounded-xl hover:bg-primary/90 transition-colors"
                                >
                                    <span className="material-symbols-outlined text-lg">chat</span>
                                    Konsultasi Gratis
                                </a>
                            </div>
                        </div>
                    </motion.aside>
                </div>

                {/* Related Projects */}
                {resolvedRelated.length > 0 && (
                    <motion.section
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="mt-16 md:mt-24"
                    >
                        <h2 className="font-serif text-xl md:text-2xl text-foreground mb-6">Proyek Lainnya</h2>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {resolvedRelated.map((related) => (
                                <Link
                                    key={related.slug}
                                    href={`/portfolio/${related.slug}`}
                                    className="group relative aspect-[4/3] rounded-2xl overflow-hidden"
                                >
                                    <Image
                                        src={related.heroImage}
                                        alt={related.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                                    <div className="absolute bottom-0 left-0 right-0 p-4">
                                        <span className="inline-block px-2 py-0.5 mb-2 bg-accent/90 text-accent-foreground text-[10px] font-bold uppercase rounded-full">
                                            {related.category}
                                        </span>
                                        <h3 className="font-serif text-lg text-white group-hover:text-accent transition-colors line-clamp-2">
                                            {related.title}
                                        </h3>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </motion.section>
                )}
            </div>
        </div>
    );
}
