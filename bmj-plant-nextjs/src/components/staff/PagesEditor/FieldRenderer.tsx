"use client";

import { ArrayFieldEditor } from "./ArrayFieldEditor";
import { ImageFieldUpload } from "./ImageFieldUpload";

interface FieldRendererProps {
  data: Record<string, unknown>;
  onChange: (field: string, value: unknown) => void;
}

export function FieldRenderer({ data, onChange }: FieldRendererProps) {
  return (
    <div className="space-y-4">
      {Object.entries(data).map(([key, value]) => {
        // Image field detection — MUST come before string checks
        if (
          typeof value === "string" &&
          /image|img|logo|avatar|photo|thumbnail|banner|cover|background/i.test(key)
        ) {
          return (
            <ImageFieldUpload
              key={key}
              fieldName={key}
              label={formatLabel(key)}
              value={value}
              onChange={(url) => onChange(key, url)}
            />
          );
        }

        // Array of objects → repeater
        if (Array.isArray(value) && value.length > 0 && typeof value[0] === "object") {
          return (
            <ArrayFieldEditor
              key={key}
              fieldName={key}
              items={value as Record<string, unknown>[]}
              onChange={(items) => onChange(key, items)}
            />
          );
        }

        // Array of strings → comma-separated input
        if (Array.isArray(value) && (value.length === 0 || typeof value[0] === "string")) {
          return (
            <div key={key}>
              <label className="block text-xs font-medium text-brand-dark/70 mb-1">
                {formatLabel(key)}
              </label>
              <input
                type="text"
                value={(value as string[]).join(", ")}
                onChange={(e) => onChange(key, e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
                className="w-full px-3 py-2 border border-brand-border rounded-lg text-sm bg-white focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent outline-none"
                placeholder={`${formatLabel(key)} (pisahkan dengan koma)`}
              />
            </div>
          );
        }

        // Boolean → toggle
        if (typeof value === "boolean") {
          return (
            <label key={key} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => onChange(key, e.target.checked)}
                className="w-4 h-4 rounded border-brand-border text-brand-accent focus:ring-brand-accent/20"
              />
              <span className="text-sm text-brand-dark">{formatLabel(key)}</span>
            </label>
          );
        }

        // Number → number input
        if (typeof value === "number") {
          return (
            <div key={key}>
              <label className="block text-xs font-medium text-brand-dark/70 mb-1">
                {formatLabel(key)}
              </label>
              <input
                type="number"
                value={value}
                onChange={(e) => onChange(key, Number(e.target.value))}
                className="w-full px-3 py-2 border border-brand-border rounded-lg text-sm bg-white focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent outline-none"
              />
            </div>
          );
        }

        // Long string (>80 chars or contains keywords) → textarea
        if (typeof value === "string" && (value.length > 80 || key.includes("description") || key.includes("paragraph") || key.includes("content"))) {
          return (
            <div key={key}>
              <label className="block text-xs font-medium text-brand-dark/70 mb-1">
                {formatLabel(key)}
              </label>
              <textarea
                value={value}
                onChange={(e) => onChange(key, e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-brand-border rounded-lg text-sm bg-white focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent outline-none resize-y"
              />
            </div>
          );
        }

        // Default string → text input
        if (typeof value === "string") {
          return (
            <div key={key}>
              <label className="block text-xs font-medium text-brand-dark/70 mb-1">
                {formatLabel(key)}
              </label>
              <input
                type="text"
                value={value}
                onChange={(e) => onChange(key, e.target.value)}
                className="w-full px-3 py-2 border border-brand-border rounded-lg text-sm bg-white focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent outline-none"
              />
            </div>
          );
        }

        // Unknown type → JSON textarea
        return (
          <div key={key}>
            <label className="block text-xs font-medium text-brand-dark/70 mb-1">
              {formatLabel(key)} (JSON)
            </label>
            <textarea
              value={JSON.stringify(value, null, 2)}
              onChange={(e) => {
                try { onChange(key, JSON.parse(e.target.value)); } catch { /* ignore parse errors while typing */ }
              }}
              rows={4}
              className="w-full px-3 py-2 border border-brand-border rounded-lg text-sm bg-white font-mono focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent outline-none resize-y"
            />
          </div>
        );
      })}
    </div>
  );
}

/** Convert camelCase/snake_case to human readable */
function formatLabel(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/^\w/, (c) => c.toUpperCase())
    .trim();
}
