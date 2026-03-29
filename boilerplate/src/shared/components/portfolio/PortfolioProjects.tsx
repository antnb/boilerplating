"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

type ProjectPhoto = { slug: string; image: string; imageAlt: string; title: string; category: string; location: string; scale: string };

type PortfolioProjectsProps = {
    projects: ProjectPhoto[];
};

const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const cardVariants = {
    hidden: {
        opacity: 0,
        y: 30,
        scale: 0.95,
    },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.5,
            ease: "easeOut" as const,
        },
    },
};

export default function PortfolioProjects({
    projects,
}: PortfolioProjectsProps) {
    return (
        <section className="mb-12 md:mb-16">
            <motion.div
                className="flex items-center justify-between mb-6 md:mb-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5 }}
            >
                <div>
                    <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.15em] text-accent mb-1">
                        Galeri Proyek
                    </p>
                    <h2 className="font-serif text-xl sm:text-2xl md:text-3xl text-foreground">
                        Proyek & Koleksi Terbaru
                    </h2>
                </div>
            </motion.div>

            {/* Responsive bento grid with stagger animation */}
            <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 auto-rows-[180px] sm:auto-rows-[200px] lg:auto-rows-[220px]"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
            >
                {projects.map((project, i) => (
                    <motion.div
                        key={project.slug}
                        variants={cardVariants}
                        className={`${
                            i === 0
                                ? "sm:col-span-2 sm:row-span-2"
                                : i === 3
                                    ? "lg:col-span-2"
                                    : ""
                        }`}
                    >
                        <Link href={`/portfolio/${project.slug}`}
                            className="group relative block h-full rounded-2xl md:rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                        >
                            <Image
                                src={project.image}
                                alt={project.imageAlt}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            />

                            {/* Gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />

                            {/* Content */}
                            <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-6">
                                <span className="self-start px-2.5 py-1 mb-2 md:mb-3 bg-accent/90 text-accent-foreground text-[9px] md:text-[10px] font-bold uppercase tracking-[0.1em] rounded-full">
                                    {project.category}
                                </span>
                                <h3 className="font-serif text-base sm:text-lg md:text-xl lg:text-2xl text-white leading-tight mb-1.5 md:mb-2 group-hover:text-accent transition-colors line-clamp-2">
                                    {project.title}
                                </h3>
                                <div className="flex flex-wrap items-center gap-2 md:gap-4 text-white/70 text-[10px] md:text-xs">
                                    <span className="flex items-center gap-1">
                                        <span className="material-symbols-outlined text-xs md:text-sm">location_on</span>
                                        {project.location}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <span className="material-symbols-outlined text-xs md:text-sm">forest</span>
                                        {project.scale}
                                    </span>
                                </div>
                            </div>

                            {/* Hover arrow indicator */}
                            <div className="absolute top-3 right-3 md:top-4 md:right-4 w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <span className="material-symbols-outlined text-white text-sm md:text-base">arrow_outward</span>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </motion.div>
        </section>
    );
}
