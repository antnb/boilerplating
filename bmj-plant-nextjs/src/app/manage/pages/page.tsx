import Link from "next/link";
import { PAGE_REGISTRY, type PageKey } from "@/lib/schemas/page-registry";

const ICONS: Record<string, string> = {
  homepage: "home", products: "inventory_2", layanan: "build",
  overview: "info", "knowledge-page": "history_edu",
  "portfolio-page": "cases", navbar: "menu",
};

export default function PagesListPage() {
  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold text-brand-dark mb-2">Pages Settings</h1>
      <p className="text-sm text-brand-dark/60 mb-8">
        Pilih halaman untuk mengedit konten sections-nya.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {(Object.entries(PAGE_REGISTRY) as [PageKey, (typeof PAGE_REGISTRY)[PageKey]][]).map(
          ([key, page]) => {
            const sectionCount = Object.keys(page.registry).length;
            return (
              <Link
                key={key}
                href={`/manage/pages/${key}`}
                className="group bg-white rounded-xl border border-brand-border p-5 hover:shadow-md hover:border-brand-accent/30 transition-all"
              >
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-2xl text-brand-accent">
                    {ICONS[key] ?? "article"}
                  </span>
                  <div className="flex-1">
                    <h3 className="font-semibold text-brand-dark group-hover:text-brand-accent transition-colors">
                      {page.label}
                    </h3>
                    <p className="text-xs text-brand-dark/50 mt-1">
                      {page.description}
                    </p>
                    <p className="text-xs text-brand-accent/70 mt-2 font-medium">
                      {sectionCount} sections
                    </p>
                  </div>
                  <span className="material-symbols-outlined text-brand-dark/20 group-hover:text-brand-accent transition-colors">
                    chevron_right
                  </span>
                </div>
              </Link>
            );
          }
        )}
      </div>
    </div>
  );
}
