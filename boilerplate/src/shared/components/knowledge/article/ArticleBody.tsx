import Image from "next/image";
import type { ArticleSpec, ArticleExpert } from "@/shared/types/article";
import { sanitizeHtml } from "@/shared/lib/utils/sanitize";

type ArticleBodyProps = {
    content: string;
    specs: ArticleSpec[];
    expert: ArticleExpert;
};

function SpecsGrid({ specs }: { specs: ArticleSpec[] }) {
    return (
        <div className="bg-muted/50 rounded-xl p-6 border border-border/10 mb-10" id="specs">
            <div className="flex items-center justify-between mb-6 border-b border-border/5 pb-3">
                <h3 className="font-serif text-xl italic text-foreground">Technical Specifications</h3>
                <span className="material-symbols-outlined text-muted-foreground/30">tune</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {specs.map((s, i) => (
                    <div key={i} className="bg-background p-4 rounded-lg border border-border/5 flex flex-col items-center text-center gap-2 shadow-sm">
                        <span className="material-symbols-outlined text-accent text-2xl">{s.icon}</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{s.label}</span>
                        <span className="text-sm font-semibold text-foreground leading-tight">{s.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function ExpertProfile({ expert }: { expert: ArticleExpert }) {
    return (
        <div className="bg-muted rounded-xl p-8 border border-accent/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-accent/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6 items-center">
                <Image src={expert.avatar} alt={`Portrait of ${expert.name}`} width={96} height={96} className="rounded-full border-4 border-background shadow-md object-cover shrink-0 mx-auto md:mx-0" />
                <div className="text-center md:text-left">
                    <div className="inline-block bg-foreground text-background text-[10px] font-bold px-2 py-1 rounded mb-2 tracking-wider">{expert.badge}</div>
                    <h4 className="font-serif text-2xl font-bold text-foreground mb-1">{expert.name}</h4>
                    <p className="text-accent font-medium text-xs uppercase tracking-wider mb-3">{expert.title}</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">{expert.bio}</p>
                </div>
            </div>
        </div>
    );
}

/** Parse HTML content and render as React elements with proper styling */
function ArticleContent({ html }: { html: string }) {
    return (
        <div
            className="article-content"
            style={{
                fontSize: '1.0625rem',
                lineHeight: '1.8',
                color: 'hsl(var(--muted-foreground))',
            }}
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(html) }}
        />
    );
}

export default function ArticleBody({ content, specs, expert }: ArticleBodyProps) {
    return (
        <article className="bg-background rounded-2xl p-8 lg:p-10 border border-border/5 shadow-sm">
            {specs.length > 0 && <SpecsGrid specs={specs} />}
            <ArticleContent html={content} />
            <div className="w-full h-px bg-border/10 my-10 flex items-center justify-center">
                <span className="bg-background px-4 text-accent font-serif italic text-lg">BMJ.</span>
            </div>
            <ExpertProfile expert={expert} />
        </article>
    );
}
