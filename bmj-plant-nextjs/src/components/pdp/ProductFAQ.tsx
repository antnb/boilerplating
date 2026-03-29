import MaterialIcon from "./MaterialIcon";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { FAQItem } from "@/types/pdp";

type ProductFAQProps = {
    items: FAQItem[];
};

export default function ProductFAQ({ items }: ProductFAQProps) {
    if (items.length === 0) return null;

    return (
        <section aria-label="Pertanyaan umum" className="relative">
            <div className="mb-4 flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/15 border border-accent/25 flex items-center justify-center shrink-0 mt-0.5">
                    <MaterialIcon name="help" className="text-accent" size={20} />
                </div>
                <div>
                    <span className="text-[10px] font-bold tracking-[0.2em] text-accent uppercase flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                        FAQ
                    </span>
                    <h2 className="font-serif text-2xl font-bold text-foreground mt-0.5">Pertanyaan Umum</h2>
                </div>
            </div>

            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm relative">
                <div className="h-1 bg-gradient-to-r from-accent via-primary/40 to-transparent" />

                <Accordion type="single" collapsible className="divide-y divide-border">
                    {items.map(({ question, answer }, idx) => (
                        <AccordionItem key={idx} value={`faq-${idx}`} className="border-none px-6">
                            <AccordionTrigger className="hover:no-underline gap-3 py-4">
                                <span className="flex items-center gap-3 text-left">
                                    <span className="w-7 h-7 rounded-full bg-primary/10 text-primary text-[11px] font-bold flex items-center justify-center shrink-0">
                                        {idx + 1}
                                    </span>
                                    <span className="font-bold text-foreground text-[13px]">{question}</span>
                                </span>
                            </AccordionTrigger>
                            <AccordionContent className="pb-4 pl-10">
                                <p className="text-[13px] text-foreground/65 leading-[1.8]">{answer}</p>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>

                <div className="absolute bottom-3 right-3 opacity-[0.03] pointer-events-none">
                    <MaterialIcon name="quiz" size={72} className="text-accent" />
                </div>
            </div>

            {/* JSON-LD FAQ structured data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "FAQPage",
                        mainEntity: items.map(({ question, answer }) => ({
                            "@type": "Question",
                            name: question,
                            acceptedAnswer: { "@type": "Answer", text: answer },
                        })),
                    }),
                }}
            />
        </section>
    );
}
