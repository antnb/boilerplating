"use client";

import { useState, type FormEvent } from "react";
import type { OverviewContactData } from "@/lib/schemas/overview-sections";

type Props = { data?: OverviewContactData };

const CONTACT_INFO = [
    { icon: "call", label: "Telepon", value: "+62 815 8666 4516", href: "tel:+6281586664516" },
    { icon: "mail", label: "Email", value: "bumimekarsarijaya@gmail.com", href: "mailto:bumimekarsarijaya@gmail.com" },
    { icon: "pin_drop", label: "Kantor & Nursery", value: "Jl. Raya Cipanas, Cianjur, Jawa Barat 43253", href: "https://maps.google.com/?q=Cipanas+Cianjur" },
] as const;

const SOCIAL = [
    { name: "Instagram", href: "#" },
    { name: "Facebook", href: "#" },
    { name: "LinkedIn", href: "#" },
] as const;

const PROJECT_TYPES = [
    "Residensial / Perumahan",
    "Komersial / Perkantoran",
    "Hotel / Resort",
    "Pemerintahan",
    "Taman Publik",
    "Retail / Eceran",
    "Lainnya",
] as const;

export function OverviewContact({ data }: Props) {
    const badge = data?.badge ?? "Hubungi Kami";
    const heading = data?.heading ?? "Mulai Konsultasi";
    const subtitle = data?.subtitle ?? "Tim kami siap membantu kebutuhan tanaman untuk proyek Anda.";
    const contactInfo = data?.contactInfo ?? CONTACT_INFO;
    const social = data?.social ?? SOCIAL;
    const formTitle = data?.formTitle ?? "Formulir Penawaran (RFQ)";
    const formSubtitle = data?.formSubtitle ?? "Isi detail kebutuhan Anda, tim kami akan merespon dalam 1×24 jam.";
    const projectTypes = data?.projectTypes ?? PROJECT_TYPES;
    const waNumber = data?.waNumber ?? "6281586664516";
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitting(true);
        const fd = new FormData(e.currentTarget);
        const name = fd.get("name") as string;
        const email = fd.get("email") as string;
        const projectType = fd.get("projectType") as string;
        const message = fd.get("message") as string;

        const waMsg = encodeURIComponent(
            `Halo BMJ, saya ${name} ingin menanyakan:\n\nEmail: ${email}\nJenis Proyek: ${projectType}\n\nPesan:\n${message}`
        );
        window.open(`https://wa.me/${waNumber}?text=${waMsg}`, "_blank");
        setSubmitting(false);
    };

    return (
        <section id="kontak" className="space-y-4 lg:space-y-6">
            {/* Header */}
            <div className="text-center">
                <span className="inline-block px-3 py-1.5 bg-accent/10 border border-accent/30 text-accent rounded-full text-2xs lg:text-xs font-bold uppercase tracking-wider mb-3 lg:mb-4">
                    {badge}
                </span>
                <h2 className="text-xl lg:text-3xl font-serif font-bold text-foreground mb-2">
                    {heading}
                </h2>
                <p className="text-muted-foreground text-sm lg:text-base max-w-2xl mx-auto">
                    {subtitle}
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
                {/* Left: Info — 5 cols */}
                <div className="lg:col-span-5 space-y-4">
                    <div className="bg-card rounded-2xl border border-border p-5 lg:p-6 space-y-4">
                        {contactInfo.map((item: any) => (
                            <a
                                key={item.label}
                                href={item.href}
                                className="flex items-start gap-3 lg:gap-4 group"
                                target={item.href.startsWith("http") ? "_blank" : undefined}
                                rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                            >
                                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-muted text-foreground flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                                    <span className="material-symbols-outlined text-lg">{item.icon}</span>
                                </div>
                                <div>
                                    <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium block mb-0.5">{item.label}</span>
                                    <span className="text-sm lg:text-base font-medium text-foreground group-hover:text-accent transition-colors">{item.value}</span>
                                </div>
                            </a>
                        ))}
                    </div>

                    <div className="bg-card rounded-2xl border border-border p-5 lg:p-6">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-3">Ikuti Kami</p>
                        <div className="flex flex-wrap gap-2">
                            {social.map((s: any) => (
                                <a
                                    key={s.name}
                                    href={s.href}
                                    className="px-4 py-2 rounded-full bg-muted text-muted-foreground text-xs font-medium hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {s.name}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right: RFQ Form — 7 cols */}
                <div className="lg:col-span-7 bg-card rounded-2xl border border-border p-5 lg:p-8">
                    <h3 className="font-serif font-bold text-foreground text-base lg:text-xl mb-1 lg:mb-2">
                        {formTitle}
                    </h3>
                    <p className="text-muted-foreground text-xs lg:text-sm mb-4 lg:mb-6">
                        {formSubtitle}
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-3 lg:space-y-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
                            <div>
                                <label htmlFor="rfq-name" className="block text-xs font-medium text-foreground mb-1.5">Nama Lengkap</label>
                                <input id="rfq-name" name="name" type="text" required placeholder="Contoh: Ahmad Hidayat"
                                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors" />
                            </div>
                            <div>
                                <label htmlFor="rfq-email" className="block text-xs font-medium text-foreground mb-1.5">Email</label>
                                <input id="rfq-email" name="email" type="email" required placeholder="email@perusahaan.com"
                                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors" />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="rfq-type" className="block text-xs font-medium text-foreground mb-1.5">Jenis Proyek</label>
                            <select id="rfq-type" name="projectType" required defaultValue=""
                                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors">
                                <option value="" disabled>Pilih Jenis Proyek</option>
                                {projectTypes.map((t: string) => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="rfq-msg" className="block text-xs font-medium text-foreground mb-1.5">Detail Kebutuhan</label>
                            <textarea id="rfq-msg" name="message" rows={4} required
                                placeholder="Jelaskan jenis tanaman, jumlah, lokasi proyek, timeline..."
                                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors resize-none" />
                        </div>

                        <button type="submit" disabled={submitting}
                            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:ring-offset-2 transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
                            <span className="material-symbols-outlined text-base">send</span>
                            {submitting ? "Mengirim..." : "Kirim Permintaan"}
                        </button>

                        <p className="text-2xs lg:text-xs text-muted-foreground text-center">
                            Form ini akan mengarahkan ke WhatsApp untuk konfirmasi langsung.
                        </p>
                    </form>
                </div>
            </div>
        </section>
    );
}
