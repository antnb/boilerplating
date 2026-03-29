import { notFound } from "next/navigation";
import { PAGE_REGISTRY, SECTION_LABELS, type PageKey } from "@/lib/schemas/page-registry";
import { getPageContentForAdmin } from "@/lib/data/page-content";
import { SectionEditor } from "@/components/staff/PagesEditor/SectionEditor";
import Link from "next/link";

export default async function PageEditorPage({
  params,
}: {
  params: Promise<{ pageKey: string }>;
}) {
  const { pageKey } = await params;

  const page = PAGE_REGISTRY[pageKey as PageKey];
  if (!page) notFound();

  // Fetch current content from DB (not cached — admin sees fresh data)
  const result = await getPageContentForAdmin(page.dbKey);
  const content = (result?.content ?? {}) as Record<string, unknown>;

  const sectionKeys = Object.keys(page.registry);

  return (
    <div className="max-w-3xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-brand-dark/50 mb-6">
        <Link href="/manage/pages" className="hover:text-brand-accent">
          Pages Settings
        </Link>
        <span>→</span>
        <span className="text-brand-dark font-medium">{page.label}</span>
      </div>

      <h1 className="text-2xl font-bold text-brand-dark mb-1">{page.label}</h1>
      <p className="text-sm text-brand-dark/60 mb-8">{page.description}</p>

      {/* Section Editors */}
      <div className="space-y-4">
        {sectionKeys.map((sectionKey) => (
          <SectionEditor
            key={sectionKey}
            pageKey={pageKey}
            sectionKey={sectionKey}
            label={SECTION_LABELS[sectionKey] ?? sectionKey}
            currentData={content[sectionKey] as Record<string, unknown> | undefined}
          />
        ))}
      </div>

      {/* Preview link */}
      <div className="mt-8 pt-6 border-t border-brand-border">
        <Link
          href={pageKey === "homepage" ? "/" : `/${page.dbKey.replace("-page", "")}`}
          target="_blank"
          className="inline-flex items-center gap-2 text-sm text-brand-accent hover:underline"
        >
          <span className="material-symbols-outlined text-base">open_in_new</span>
          Preview halaman di website
        </Link>
      </div>
    </div>
  );
}
