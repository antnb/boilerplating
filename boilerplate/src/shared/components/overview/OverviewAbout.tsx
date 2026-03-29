import Image from "next/image";
import type { OverviewAboutData } from '@/shared/lib/schemas/overview-sections';
import greenhouseImg from "@/shared/assets/images/greenhouse-interior.webp";

type Props = { data?: OverviewAboutData };

const DEFAULT_PARAGRAPHS = [
    'PT Bumi Mekarsari Jaya (BMJ) berdiri sebagai kurator kualitas dalam industri tanaman hias Indonesia. Berawal dari kelompok tani di kawasan Cipanas — pusat nursery legendaris di Jawa Barat — kami membangun jaringan yang menghubungkan puluhan nursery petani lokal dengan pasar nasional.',
    'Dengan lebih dari satu dekade pengalaman, BMJ bukan sekadar supplier — kami adalah mitra strategis yang memahami bahwa setiap proyek lanskap memiliki kebutuhan unik. Dari resort mewah di Bali hingga gedung perkantoran di Jakarta, jaringan 50+ nursery mitra kami memastikan varietas yang tepat, dalam kualitas terbaik, tersedia tepat waktu.',
    'Model bisnis kami unik: satu pintu transaksi, banyak sumber tanaman. Ini memungkinkan kami menawarkan varietas jauh lebih beragam dibanding nursery tunggal, dengan kapasitas supply yang siap melayani proyek berskala apa pun.',
];

export function OverviewAbout({ data }: Props) {
    const badge = data?.badge ?? 'Tentang BMJ';
    const heading = data?.heading ?? 'Dari Jaringan Petani, untuk Indonesia';
    const paragraphs = data?.paragraphs ?? DEFAULT_PARAGRAPHS;
    const stat1Value = data?.stat1Value ?? '10+';
    const stat1Label = data?.stat1Label ?? 'th Pengalaman';
    const stat2Value = data?.stat2Value ?? '100%';
    const stat2Label = data?.stat2Label ?? 'Garansi Kualitas';
    const aboutImage = data?.aboutImage ?? greenhouseImg;
    const aboutImageAlt = data?.aboutImageAlt ?? 'Tim BMJ mengecek kualitas tanaman di nursery Cipanas';

    return (
        <section id="tentang-kami" className="bg-card rounded-2xl lg:rounded-3xl border border-border overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                {/* Text — 7 cols */}
                <div className="lg:col-span-7 p-6 lg:p-12 flex flex-col justify-center">
                    <span className="inline-block w-fit px-3 py-1.5 bg-accent/10 border border-accent/30 text-accent rounded-full text-2xs lg:text-xs font-bold uppercase tracking-wider mb-4 lg:mb-6">
                        {badge}
                    </span>

                    <h2 className="text-xl lg:text-3xl font-serif font-bold text-foreground leading-snug mb-4 lg:mb-6">
                        {heading}
                    </h2>

                    <div className="space-y-4 text-sm lg:text-base text-muted-foreground leading-relaxed">
                        {paragraphs.map((p: string, i: number) => <p key={i}>{p}</p>)}
                    </div>

                    {/* Mini stats */}
                    <div className="flex items-center gap-6 lg:gap-8 mt-6 lg:mt-8 pt-5 lg:pt-6 border-t border-border">
                        <div className="text-center">
                            <span className="block text-2xl lg:text-3xl font-serif font-bold text-foreground">{stat1Value}</span>
                            <span className="text-2xs lg:text-xs text-muted-foreground font-medium uppercase tracking-wide">{stat1Label}</span>
                        </div>
                        <div className="w-px h-10 bg-border" />
                        <div className="text-center">
                            <span className="block text-2xl lg:text-3xl font-serif font-bold text-accent">{stat2Value}</span>
                            <span className="text-2xs lg:text-xs text-muted-foreground font-medium uppercase tracking-wide">{stat2Label}</span>
                        </div>
                    </div>
                </div>

                {/* Photo — 5 cols */}
                <div className="lg:col-span-5 relative h-[280px] lg:h-auto min-h-[300px]">
                    <Image
                        src={aboutImage}
                        alt={aboutImageAlt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 42vw"
                    />
                </div>
            </div>
        </section>
    );
}
