import { sanitizeHtml } from "@/shared/lib/utils/sanitize";

type ProjectBodyProps = {
    description: string | null;
    content: string | null;
    challenge: string | null;
    solution: string | null;
    result: string | null;
};

export default function ProjectBody({
    description,
    content,
    challenge,
    solution,
    result,
}: ProjectBodyProps) {
    const hasNarrative = challenge || solution || result;

    return (
        <div className="space-y-8">
            {/* Description */}
            {description && (
                <p className="text-base text-brand-dark/80 leading-relaxed">
                    {description}
                </p>
            )}

            {/* Rich text content (TipTap HTML) */}
            {content && (
                <div
                    className="prose prose-brand max-w-none"
                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }}
                />
            )}

            {/* Structured narrative sections */}
            {hasNarrative && (
                <div className="grid grid-cols-1 gap-6">
                    {challenge && (
                        <div className="bg-red-50/50 rounded-2xl p-6">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="material-symbols-outlined text-red-500">warning</span>
                                <h3 className="font-serif text-lg text-brand-dark">Tantangan</h3>
                            </div>
                            <p className="text-sm text-brand-dark/70 leading-relaxed">{challenge}</p>
                        </div>
                    )}
                    {solution && (
                        <div className="bg-blue-50/50 rounded-2xl p-6">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="material-symbols-outlined text-blue-500">lightbulb</span>
                                <h3 className="font-serif text-lg text-brand-dark">Solusi</h3>
                            </div>
                            <p className="text-sm text-brand-dark/70 leading-relaxed">{solution}</p>
                        </div>
                    )}
                    {result && (
                        <div className="bg-green-50/50 rounded-2xl p-6">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="material-symbols-outlined text-green-500">check_circle</span>
                                <h3 className="font-serif text-lg text-brand-dark">Hasil</h3>
                            </div>
                            <p className="text-sm text-brand-dark/70 leading-relaxed">{result}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
