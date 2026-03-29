// Server Component — no "use client" needed
import Link from "next/link";
import { PAGE_REGISTRY, type PageKey } from "@/lib/schemas/page-registry";

const ICONS: Record<string, string> = {
  homepage: "home",
  products: "inventory_2",
  layanan: "build",
  overview: "info",
  "knowledge-page": "history_edu",
  "portfolio-page": "cases",
  navbar: "menu",
};

export function PagesAdminSidebar() {
  return (
    <aside className="w-56 bg-brand-dark text-brand-bg flex flex-col shrink-0 sticky top-0 h-screen">
      {/* Back to admin */}
      <Link
        href="/manage"
        className="flex items-center gap-2 px-5 py-4 text-sm font-semibold border-b border-white/10 hover:bg-white/5"
      >
        <span className="material-symbols-outlined text-base">arrow_back</span>
        Kembali ke Admin
      </Link>

      <div className="px-5 py-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-brand-accent mb-1">
          Pages Settings
        </h2>
        <p className="text-[11px] text-white/50">Kelola konten halaman</p>
      </div>

      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
        {(Object.entries(PAGE_REGISTRY) as [PageKey, (typeof PAGE_REGISTRY)[PageKey]][]).map(
          ([key, page]) => (
            <Link
              key={key}
              href={`/manage/pages/${key}`}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/70 hover:bg-white/10 hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined text-lg">
                {ICONS[key] ?? "article"}
              </span>
              {page.label}
            </Link>
          )
        )}
      </nav>

      <div className="px-5 py-4 border-t border-white/10">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 text-xs text-white/40 hover:text-white/70"
        >
          <span className="material-symbols-outlined text-sm">open_in_new</span>
          Lihat Website
        </Link>
      </div>
    </aside>
  );
}
