import Link from "next/link";
/* Footer */

export function Footer() {
    return (
        <footer className="bg-brand-dark text-white mt-8 md:mt-12 pt-10 md:pt-16 pb-6 md:pb-8 px-4 md:px-8">
            <div className="container-page">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-10 md:mb-16">
                    {/* Col 1: Logo + Company + Social */}
                    <div className="col-span-2 md:col-span-1">
                        <Link href="/"
                            className="text-2xl md:text-3xl font-serif font-bold tracking-tight mb-4 md:mb-6 block"
                        >
                            BMJ<span className="text-brand-accent">.</span>
                        </Link>
                        <p className="text-white/60 text-xs md:text-sm leading-relaxed mb-4 md:mb-6">
                            PT Bumi Mekarsari Jaya
                        </p>
                        <div className="flex gap-3 md:gap-4">
                            <a
                                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-accent hover:text-brand-dark transition-colors"
                                href="#"
                                aria-label="Facebook"
                            >
                                <span className="material-icons text-sm md:text-base">
                                    facebook
                                </span>
                            </a>
                            <a
                                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-accent hover:text-brand-dark transition-colors"
                                href="#"
                                aria-label="Instagram"
                            >
                                <span className="material-icons text-sm md:text-base">
                                    camera_alt
                                </span>
                            </a>
                            <a
                                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-accent hover:text-brand-dark transition-colors"
                                href="#"
                                aria-label="Email"
                            >
                                <span className="material-icons text-sm md:text-base">
                                    alternate_email
                                </span>
                            </a>
                        </div>
                    </div>

                    {/* Col 2: Explore */}
                    <div className="col-span-1">
                        <h4 className="text-base md:text-lg font-bold mb-4 md:mb-6 text-brand-accent">
                            Explore
                        </h4>
                        <ul className="space-y-2 md:space-y-3 text-xs md:text-sm text-white/70">
                            <li>
                                <a
                                    className="hover:text-white transition-colors"
                                    href="#"
                                >
                                    Rare Plant Collection
                                </a>
                            </li>
                            <li>
                                <a
                                    className="hover:text-white transition-colors"
                                    href="#"
                                >
                                    Large Specimen Trees
                                </a>
                            </li>
                            <li>
                                <a
                                    className="hover:text-white transition-colors"
                                    href="#"
                                >
                                    Ceramic Pots &amp; Planters
                                </a>
                            </li>
                            <li>
                                <a
                                    className="hover:text-white transition-colors"
                                    href="#"
                                >
                                    Care Accessories
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Col 3: Company */}
                    <div className="col-span-1">
                        <h4 className="text-base md:text-lg font-bold mb-4 md:mb-6 text-brand-accent">
                            Company
                        </h4>
                        <ul className="space-y-2 md:space-y-3 text-xs md:text-sm text-white/70">
                            <li>
                                <a
                                    className="hover:text-white transition-colors"
                                    href="#"
                                >
                                    About Us
                                </a>
                            </li>
                            <li>
                                <a
                                    className="hover:text-white transition-colors"
                                    href="#"
                                >
                                    Our Nursery
                                </a>
                            </li>
                            <li>
                                <a
                                    className="hover:text-white transition-colors"
                                    href="#"
                                >
                                    Sustainability
                                </a>
                            </li>
                            <li>
                                <a
                                    className="hover:text-white transition-colors"
                                    href="#"
                                >
                                    Careers
                                </a>
                            </li>
                            <li>
                                <span className="inline-block border border-white/20 rounded px-2 py-0.5 text-2xs md:text-xs text-white/50 mt-1 md:mt-2">
                                    NIB: 0712240010385
                                </span>
                            </li>
                        </ul>
                    </div>

                    {/* Col 4: Contact — full width on mobile 2-col grid */}
                    <div className="col-span-2 md:col-span-1">
                        <h4 className="text-base md:text-lg font-bold mb-4 md:mb-6 text-brand-accent">
                            Contact
                        </h4>
                        <address className="space-y-2 md:space-y-3 text-xs md:text-sm text-white/70 not-italic">
                            <p className="flex items-center gap-2">
                                <span className="material-icons text-xs md:text-sm">
                                    location_on
                                </span>
                                Cipanas, Cianjur, Jawa Barat 43253
                            </p>
                            <p className="flex items-center gap-2">
                                <span className="material-icons text-xs md:text-sm">phone</span>
                                081586664516
                            </p>
                            <p className="flex items-center gap-2">
                                <span className="material-icons text-xs md:text-sm">email</span>
                                bumimekarsarijaya@gmail.com
                            </p>
                        </address>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="border-t border-white/10 pt-6 md:pt-8 flex flex-col items-center gap-4 md:flex-row md:justify-between md:gap-6">
                    <p className="text-2xs md:text-xs text-white/40">
                        © 2024 PT Bumi Mekarsari Jaya. All rights reserved.
                    </p>
                    <div className="flex items-center gap-2 md:gap-6 opacity-60 grayscale hover:grayscale-0 transition-all duration-500 flex-wrap justify-center">
                        <span className="text-2xs md:text-xs font-bold text-white/60 uppercase tracking-widest border px-2 py-0.5 md:py-1 rounded border-white/30">
                            Secure SSL
                        </span>
                        <span className="text-2xs md:text-xs font-bold text-white/60 uppercase tracking-widest border px-2 py-0.5 md:py-1 rounded border-white/30">
                            Visa
                        </span>
                        <span className="text-2xs md:text-xs font-bold text-white/60 uppercase tracking-widest border px-2 py-0.5 md:py-1 rounded border-white/30">
                            Mastercard
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
