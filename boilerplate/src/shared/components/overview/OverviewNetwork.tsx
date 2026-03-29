"use client";

import { useState, useEffect } from "react";
import type { OverviewNetworkData } from "@/shared/lib/schemas/overview-sections";

type Props = { data?: OverviewNetworkData };

export function OverviewNetwork({ data }: Props) {
    const SATELLITES = data?.satellites ?? [
        { label: "Tanaman Hias", angle: 0 }, { label: "Tanaman Buah", angle: 60 }, { label: "Pohon Besar", angle: 120 },
        { label: "Groundcover", angle: 180 }, { label: "Tanaman Hias", angle: 240 }, { label: "Palm & Palem", angle: 300 },
    ];
    const MITRA = data?.mitra ?? [
        { name: "Nursery Cipanas Indah", specialty: "Spesialis Aroid & Philodendron", capacity: "5.000+ unit/bulan" },
        { name: "Kebun Bunga Puncak", specialty: "Tanaman Hias Outdoor & Groundcover", capacity: "10.000+ unit/bulan" },
        { name: "Agro Nursery Lembang", specialty: "Pohon Besar & Tanaman Peneduh", capacity: "2.000+ unit/bulan" },
    ];
    const centerLabel = data?.centerLabel ?? "BMJ";
    const centerSubtitle = data?.centerSubtitle ?? "Pusat Koordinasi";
    const heading = data?.heading ?? "Sistem Jaringan Terintegrasi";
    const description = data?.description ?? "Kami mengelola kualitas dari berbagai titik satelit nursery untuk memastikan ketersediaan stok yang konsisten sepanjang tahun.";
    const mitraTitle = data?.mitraTitle ?? "Mitra Unggulan";
    const [radius, setRadius] = useState(130);

    useEffect(() => {
        const handleResize = () => setRadius(window.innerWidth < 1024 ? 85 : 130);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <section
            id="jaringan"
            className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 bg-muted/50 rounded-2xl lg:rounded-3xl p-3 lg:p-4 border border-border"
        >
            {/* Hub diagram — 7 cols */}
            <div className="lg:col-span-7 bg-primary rounded-2xl p-6 lg:p-10 relative overflow-hidden flex flex-col justify-center min-h-[360px] lg:min-h-[440px]">
                {/* Dot grid */}
                <div className="absolute inset-0 opacity-10 pointer-events-none dot-grid" />

                <div className="relative z-10 w-full flex flex-col items-center justify-center py-8">
                    {/* Hub */}
                    <div className="relative mb-8 lg:mb-12" style={{ width: radius * 2 + 80, height: radius * 2 + 80 }}>
                        {/* Center */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 lg:w-32 lg:h-32 rounded-full border-2 border-accent bg-primary flex items-center justify-center z-20 shadow-[0_0_40px_rgba(212,175,55,0.3)]">
                            <div className="text-center">
                                <span className="block text-xl lg:text-2xl font-serif font-bold text-primary-foreground">{centerLabel}</span>
                                <span className="block text-3xs lg:text-2xs text-accent uppercase tracking-widest mt-1">{centerSubtitle}</span>
                            </div>
                        </div>

                        {/* Satellites */}
                        {SATELLITES.map((sat: any, i: number) => {
                            const radian = (sat.angle * Math.PI) / 180;
                            const x = Math.cos(radian) * radius;
                            const y = Math.sin(radian) * radius;
                            return (
                                <div
                                    key={i}
                                    className="absolute top-1/2 left-1/2 z-10"
                                    style={{
                                        transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                                    }}
                                >
                                    <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-sm">
                                        <span className="text-3xs lg:text-3xs text-primary-foreground/80 font-medium leading-tight text-center px-1">{sat.label}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <h2 className="text-xl lg:text-3xl font-serif text-primary-foreground text-center mb-2">
                        {heading}
                    </h2>
                    <p className="text-primary-foreground/60 text-center text-xs lg:text-sm max-w-md">
                        {description}
                    </p>
                </div>
            </div>

            {/* Mitra — 5 cols */}
            <div className="lg:col-span-5 flex flex-col gap-3 lg:gap-4 justify-center p-2 lg:p-4">
                <h3 className="text-base lg:text-xl font-bold text-foreground mb-1 px-2">
                    {mitraTitle}
                </h3>

                {MITRA.map((mitra: any) => (
                    <div
                        key={mitra.name}
                        className="bg-card rounded-xl p-4 lg:p-5 border border-border flex flex-col gap-2"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-muted flex items-center justify-center">
                                <span className="material-symbols-outlined text-foreground text-xl">eco</span>
                            </div>
                            <div>
                                <h4 className="font-serif font-bold text-foreground text-sm lg:text-base">{mitra.name}</h4>
                                <p className="text-xs text-accent font-medium">{mitra.specialty}</p>
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground">Kapasitas: {mitra.capacity}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
