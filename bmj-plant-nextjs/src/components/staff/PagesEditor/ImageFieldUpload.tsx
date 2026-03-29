"use client";

import { useState, useRef } from "react";
import Image from "next/image";

interface ImageFieldUploadProps {
  fieldName: string;
  label: string;
  value: string;
  onChange: (url: string) => void;
}

export function ImageFieldUpload({
  fieldName,
  label,
  value,
  onChange,
}: ImageFieldUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Client-side validation
    const ALLOWED = ["image/jpeg", "image/png", "image/webp"];
    if (!ALLOWED.includes(file.type)) {
      setError("Hanya file JPG, PNG, atau WEBP yang diizinkan");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Ukuran file maksimal 5MB");
      return;
    }

    setError(null);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.set("file", file);
      formData.set("bucket", "pages");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        setError(result.error ?? "Upload gagal");
        return;
      }

      onChange(result.url);
    } catch {
      setError("Gagal menghubungi server");
    } finally {
      setIsUploading(false);
      // Reset input so same file can be re-selected
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  // Determine if value is a valid image URL for preview
  const hasPreview = value && (
    value.startsWith("/") ||
    value.startsWith("http")
  );

  return (
    <div>
      <label className="block text-xs font-medium text-brand-dark/70 mb-1">
        {label}
      </label>

      {/* Preview */}
      {hasPreview && (
        <div className="relative w-full h-32 mb-2 rounded-lg overflow-hidden bg-brand-bg border border-brand-border">
          <Image
            src={value}
            alt={label}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 600px"
            unoptimized
          />
        </div>
      )}

      {/* Upload button + URL input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="URL gambar atau upload file"
          className="flex-1 px-3 py-2 border border-brand-border rounded-lg text-sm bg-white focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent outline-none"
        />
        <label
          className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors ${
            isUploading
              ? "bg-gray-200 text-gray-400 cursor-wait"
              : "bg-brand-accent/10 text-brand-accent hover:bg-brand-accent/20"
          }`}
        >
          <span className="material-symbols-outlined text-base">
            {isUploading ? "hourglass_empty" : "upload"}
          </span>
          {isUploading ? "Uploading..." : "Upload"}
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            disabled={isUploading}
            className="hidden"
          />
        </label>
      </div>

      {/* Error */}
      {error && (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      )}

      {/* Help text */}
      <p className="text-[11px] text-brand-dark/40 mt-1">
        JPG, PNG, atau WEBP. Maks 5MB. Atau masukkan URL manual.
      </p>
    </div>
  );
}
