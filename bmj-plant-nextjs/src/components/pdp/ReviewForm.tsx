"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { submitReview } from "@/lib/actions/review-actions";
import { Loader2, Send, Star, ImagePlus, X } from "lucide-react";

interface ReviewFormProps {
  plantId: string;
  isLoggedIn: boolean;
  hasPurchased: boolean;
  onSubmitted?: () => void;
}

const MAX_PHOTOS = 3;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export default function ReviewForm({ plantId, isLoggedIn, hasPurchased, onSubmitted }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Not logged in
  if (!isLoggedIn) {
    return (
      <div className="rounded-xl border border-border bg-card/50 p-5 text-center">
        <p className="text-sm text-muted-foreground">
          <a href="/login" className="text-primary font-semibold underline underline-offset-2 hover:text-primary/80">
            Login
          </a>{" "}
          untuk memberikan ulasan
        </p>
      </div>
    );
  }

  // Not a purchaser
  if (!hasPurchased) {
    return (
      <div className="rounded-xl border border-border bg-card/50 p-5 text-center space-y-2">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto">
          <span className="material-symbols-outlined text-muted-foreground text-xl">shopping_bag</span>
        </div>
        <p className="text-sm font-semibold text-foreground">Beli dulu, baru bisa review</p>
        <p className="text-xs text-muted-foreground">
          Ulasan hanya tersedia untuk pelanggan yang sudah membeli dan menerima produk ini.
        </p>
      </div>
    );
  }

  // Already submitted
  if (submitted) {
    return (
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-5 text-center space-y-2">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
          <span className="material-symbols-outlined text-primary text-xl">check_circle</span>
        </div>
        <p className="text-sm font-semibold text-foreground">Terima kasih atas ulasan Anda!</p>
        <p className="text-xs text-muted-foreground">Ulasan Anda akan ditampilkan setelah diverifikasi.</p>
      </div>
    );
  }

  // ── Photo handlers ──
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const remaining = MAX_PHOTOS - photoFiles.length;
    if (remaining <= 0) {
      toast.error(`Maksimal ${MAX_PHOTOS} foto`);
      return;
    }

    const validFiles: File[] = [];
    for (const file of files.slice(0, remaining)) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        toast.error(`${file.name}: Hanya JPG, PNG, WebP`);
        continue;
      }
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`${file.name}: Ukuran maksimal 5MB`);
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length > 0) {
      setPhotoFiles(prev => [...prev, ...validFiles]);
      const newPreviews = validFiles.map(f => URL.createObjectURL(f));
      setPhotoPreviews(prev => [...prev, ...newPreviews]);
    }

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removePhoto = (index: number) => {
    URL.revokeObjectURL(photoPreviews[index]);
    setPhotoFiles(prev => prev.filter((_, i) => i !== index));
    setPhotoPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const uploadPhotos = async (): Promise<string[]> => {
    if (photoFiles.length === 0) return [];
    const urls: string[] = [];
    for (const file of photoFiles) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("bucket", "review-photos");
      formData.append("productId", plantId);

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Upload foto gagal");
      urls.push(json.url);
    }
    return urls;
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("Pilih rating terlebih dahulu");
      return;
    }
    if (!comment.trim()) {
      toast.error("Komentar wajib diisi");
      return;
    }

    setSubmitting(true);
    try {
      // Step 1: Upload photos (if any)
      setUploading(true);
      let photoUrls: string[] = [];
      if (photoFiles.length > 0) {
        photoUrls = await uploadPhotos();
      }
      setUploading(false);

      // Step 2: Submit review with photo URLs
      const result = await submitReview(plantId, {
        rating,
        title,
        comment,
        photos: photoUrls,
      });

      if (result.success) {
        setSubmitted(true);
        toast.success("Ulasan berhasil dikirim!");
        onSubmitted?.();
      } else {
        toast.error(result.error || "Gagal mengirim ulasan");
      }
    } catch {
      toast.error("Terjadi kesalahan. Coba lagi.");
    } finally {
      setSubmitting(false);
      setUploading(false);
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-4">
      <h4 className="font-serif text-base font-semibold text-foreground">Tulis Ulasan</h4>

      {/* Star Rating Picker */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-muted-foreground">Rating *</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(star)}
              className="p-0.5 transition-transform hover:scale-110"
              aria-label={`${star} star`}
            >
              <Star
                className={`w-6 h-6 transition-colors ${
                  star <= (hoverRating || rating)
                    ? "fill-accent text-accent"
                    : "fill-none text-border"
                }`}
              />
            </button>
          ))}
          {rating > 0 && (
            <span className="ml-2 text-xs text-muted-foreground self-center">
              {rating}/5
            </span>
          )}
        </div>
      </div>

      {/* Title (optional) */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-muted-foreground">Judul (opsional)</label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ringkasan singkat ulasan Anda"
          maxLength={200}
          disabled={submitting}
        />
      </div>

      {/* Comment */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-muted-foreground">Komentar *</label>
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Ceritakan pengalaman Anda dengan tanaman ini..."
          rows={3}
          maxLength={2000}
          disabled={submitting}
        />
        <p className="text-2xs text-muted-foreground text-right">{comment.length}/2000</p>
      </div>

      {/* Photo Upload */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-muted-foreground">
          Foto (opsional, maks {MAX_PHOTOS})
        </label>

        {photoPreviews.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {photoPreviews.map((src, i) => (
              <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-border group">
                <Image src={src} alt={`Foto ${i + 1}`} fill className="object-cover" />
                <button
                  type="button"
                  onClick={() => removePhoto(i)}
                  className="absolute top-1 right-1 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label={`Hapus foto ${i + 1}`}
                >
                  <X className="w-3 h-3 text-white" />
                </button>
              </div>
            ))}
          </div>
        )}

        {photoFiles.length < MAX_PHOTOS && (
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={handlePhotoSelect}
              className="hidden"
              disabled={submitting}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={submitting}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-border text-xs text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors disabled:opacity-50"
            >
              <ImagePlus className="w-4 h-4" />
              Tambah Foto ({photoFiles.length}/{MAX_PHOTOS})
            </button>
          </>
        )}
      </div>

      {/* Submit */}
      <Button
        onClick={handleSubmit}
        disabled={submitting || rating === 0}
        className="w-full"
        size="sm"
      >
        {submitting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            {uploading ? "Mengupload foto..." : "Mengirim..."}
          </>
        ) : (
          <>
            <Send className="w-4 h-4 mr-2" />
            Kirim Ulasan
          </>
        )}
      </Button>
    </div>
  );
}
