"use client";

import { useState, useTransition, useRef } from "react";
import { updatePageSection } from "@/shared/lib/actions/page-content-actions";
import { FieldRenderer } from "./FieldRenderer";
import { toast } from "sonner";

interface SectionEditorProps {
  pageKey: string;
  sectionKey: string;
  label: string;
  currentData: Record<string, unknown> | undefined;
}

export function SectionEditor({
  pageKey,
  sectionKey,
  label,
  currentData,
}: SectionEditorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<Record<string, unknown>>(currentData ?? {});
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  function handleFieldChange(fieldName: string, value: unknown) {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const fd = new FormData();
    fd.set("pageKey", pageKey);
    fd.set("sectionKey", sectionKey);
    fd.set("data", JSON.stringify(formData));

    startTransition(async () => {
      const result = await updatePageSection(fd);
      if (result.success) {
        toast.success(`${label} berhasil disimpan`);
      } else {
        toast.error(result.error ?? "Gagal menyimpan");
      }
    });
  }

  return (
    <div className="bg-white rounded-xl border border-brand-border overflow-hidden">
      {/* Accordion Header */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-brand-bg/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-lg text-brand-accent">
            {isOpen ? "expand_less" : "expand_more"}
          </span>
          <span className="font-semibold text-sm text-brand-dark">{label}</span>
        </div>
        <span className="text-xs text-brand-dark/40">
          {Object.keys(formData).length} fields
        </span>
      </button>

      {/* Accordion Body */}
      {isOpen && (
        <form ref={formRef} onSubmit={handleSubmit} className="border-t border-brand-border p-5 space-y-4">
          <FieldRenderer
            data={formData}
            onChange={handleFieldChange}
          />

          <div className="flex items-center gap-3 pt-4 border-t border-brand-border/50">
            <button
              type="submit"
              disabled={isPending}
              className="px-5 py-2 bg-brand-accent text-white text-sm font-semibold rounded-lg hover:bg-brand-accent/90 disabled:opacity-50 transition-colors"
            >
              {isPending ? "Menyimpan..." : "Simpan"}
            </button>
            <button
              type="button"
              onClick={() => {
                setFormData(currentData ?? {});
                toast.info("Perubahan direset");
              }}
              className="px-4 py-2 text-sm text-brand-dark/60 hover:text-brand-dark transition-colors"
            >
              Reset
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
