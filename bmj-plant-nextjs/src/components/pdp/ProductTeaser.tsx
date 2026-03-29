import MaterialIcon from "./MaterialIcon";

interface ProductTeaserProps {
    teaser?: string | null;
}

const FALLBACK = "Tanaman eksotis berkualitas tinggi yang dibudidayakan dengan penuh perhatian.";

export default function ProductTeaser({ teaser }: ProductTeaserProps) {
    const text = teaser?.trim() || FALLBACK;

    return (
        <div className="bg-gradient-to-br from-primary/5 via-background to-primary/10 rounded-xl border border-border p-4">
            <p className="text-sm text-foreground leading-relaxed line-clamp-2">
                <MaterialIcon name="format_quote" size={14} className="text-primary/40 mr-1 inline" />
                {text}
            </p>
        </div>
    );
}
