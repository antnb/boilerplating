"use client";

import NextImage from "next/image";
import { sanitizeHtml } from "@/lib/utils/sanitize";
import { useState, useCallback, useRef } from "react";
import { Portal } from "@/components/ui/portal";
import { useOverlay } from "@/hooks/useOverlay";
import { X, Upload, Eye, EyeOff, Save, Bold, Italic, Heading2, List, Link2, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface ArticleData {
  id?: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  status: "draft" | "published";
  author: string;
}

const CATEGORIES = ["Perawatan", "Panduan", "Tren", "Tips", "Inspirasi"];

interface Props {
  article?: Partial<ArticleData>;
  onClose: () => void;
  onSave?: (data: ArticleData) => void;
}

export function ArticleEditor({ article, onClose, onSave }: Props) {
  const stableClose = useCallback(() => onClose(), [onClose]);
  useOverlay(true, stableClose);

  const isEdit = !!article?.id;
  const [showPreview, setShowPreview] = useState(false);
  const [form, setForm] = useState<ArticleData>({
    title: article?.title || "",
    slug: article?.slug || "",
    category: article?.category || "",
    excerpt: article?.excerpt || "",
    content: article?.content || "",
    coverImage: article?.coverImage || null,
    status: article?.status || "draft",
    author: article?.author || "Pak Andi",
  });
  const [coverUploading, setCoverUploading] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const update = (key: keyof ArticleData, value: string | null) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const autoSlug = (title: string) =>
    title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const handleTitleChange = (val: string) => {
    update("title", val);
    if (!isEdit) update("slug", autoSlug(val));
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCoverUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucket', 'articles');

      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();

      if (!data.success) {
        toast.error(data.error || 'Upload gagal');
        return;
      }

      update('coverImage', data.url);
      toast.success('Cover image berhasil diupload');
    } catch {
      toast.error('Upload gagal. Coba lagi.');
    } finally {
      setCoverUploading(false);
      if (coverInputRef.current) coverInputRef.current.value = '';
    }
  };

  const insertMarkdown = (syntax: string) => {
    update("content", form.content + syntax);
  };

  const handleSave = (asDraft?: boolean) => {
    if (!form.title.trim()) { toast.error("Judul wajib diisi"); return; }
    const data = { ...form, status: asDraft ? "draft" as const : form.status };
    onSave?.(data);
    toast.success(asDraft ? "Disimpan sebagai draft" : isEdit ? "Artikel berhasil diupdate!" : "Artikel berhasil dipublikasi!");
    onClose();
  };

  const renderPreview = (md: string) => {
    return md
      .replace(/^### (.+)/gm, '<h3 class="text-lg font-bold mt-4 mb-2">$1</h3>')
      .replace(/^## (.+)/gm, '<h2 class="text-xl font-bold mt-5 mb-2">$1</h2>')
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/^- (.+)/gm, '<li class="ml-4 list-disc">$1</li>')
      .replace(/\n/g, "<br />");
  };

  return (
    <Portal>
    <div className="fixed top-0 left-0 w-screen z-[100] flex items-center justify-center p-2 md:p-4" style={{ height: '100dvh' }}>
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-4xl bg-background rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[95dvh]">
        {/* Header */}
        <div className="border-b px-5 py-3 flex items-center justify-between shrink-0">
          <h2 className="font-bold text-lg">{isEdit ? "Edit Artikel" : "Tulis Artikel Baru"}</h2>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setShowPreview(!showPreview)}>
              {showPreview ? <EyeOff className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
              {showPreview ? "Editor" : "Preview"}
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}><X className="w-5 h-5" /></Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {!showPreview ? (
            <>
              {/* Cover Image */}
              <input
                ref={coverInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleCoverUpload}
              />
              <div
                className="w-full h-40 rounded-xl border-2 border-dashed border-border hover:border-primary/50 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors bg-muted/30"
                onClick={() => !coverUploading && coverInputRef.current?.click()}
              >
                {form.coverImage ? (
                  <NextImage src={form.coverImage} alt="" width={800} height={160} className="object-cover rounded-xl" />
                ) : coverUploading ? (
                  <>
                    <Upload className="w-6 h-6 text-muted-foreground animate-pulse" />
                    <span className="text-sm text-muted-foreground">Mengupload...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-6 h-6 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Klik untuk upload cover image</span>
                  </>
                )}
              </div>

              {/* Title & Meta */}
              <Input
                value={form.title}
                onChange={e => handleTitleChange(e.target.value)}
                placeholder="Judul Artikel..."
                className="text-xl font-bold border-0 px-0 focus-visible:ring-0 placeholder:text-muted-foreground/40"
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Slug</Label>
                  <Input value={form.slug} onChange={e => update("slug", e.target.value)} className="font-mono text-xs" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Kategori</Label>
                  <Select value={form.category} onValueChange={v => update("category", v)}>
                    <SelectTrigger><SelectValue placeholder="Pilih" /></SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Penulis</Label>
                  <Input value={form.author} onChange={e => update("author", e.target.value)} />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Excerpt</Label>
                <Input value={form.excerpt} onChange={e => update("excerpt", e.target.value)} placeholder="Ringkasan singkat..." />
              </div>

              {/* Toolbar */}
              <div className="flex items-center gap-1 border rounded-lg p-1 bg-muted/30">
                <Button variant="ghost" size="icon-sm" onClick={() => insertMarkdown("**bold**")}><Bold className="w-3.5 h-3.5" /></Button>
                <Button variant="ghost" size="icon-sm" onClick={() => insertMarkdown("*italic*")}><Italic className="w-3.5 h-3.5" /></Button>
                <Button variant="ghost" size="icon-sm" onClick={() => insertMarkdown("\n## Heading\n")}><Heading2 className="w-3.5 h-3.5" /></Button>
                <Button variant="ghost" size="icon-sm" onClick={() => insertMarkdown("\n- List item\n")}><List className="w-3.5 h-3.5" /></Button>
                <Button variant="ghost" size="icon-sm" onClick={() => insertMarkdown("[link](url)")}><Link2 className="w-3.5 h-3.5" /></Button>
                <Button variant="ghost" size="icon-sm" onClick={() => insertMarkdown("\n![alt](image-url)\n")}><Image className="w-3.5 h-3.5" /></Button>
              </div>

              {/* Content Editor */}
              <Textarea
                value={form.content}
                onChange={e => update("content", e.target.value)}
                placeholder="Tulis konten artikel di sini... (Markdown supported)"
                rows={12}
                className="font-mono text-sm"
              />
            </>
          ) : (
            /* Preview Mode */
            <div className="prose prose-sm max-w-none">
              {form.coverImage && <NextImage src={form.coverImage} alt="" width={800} height={192} className="object-cover rounded-xl mb-4" />}
              <h1 className="text-2xl font-bold mb-2">{form.title || "Untitled"}</h1>
              <p className="text-muted-foreground text-sm mb-4">{form.author} · {form.category}</p>
              {form.excerpt && <p className="text-muted-foreground italic border-l-4 border-primary pl-3 mb-4">{form.excerpt}</p>}
              <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(renderPreview(form.content)) }} />
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t px-5 py-3 flex items-center justify-between shrink-0">
          <Button variant="outline" onClick={() => handleSave(true)}>
            Simpan Draft
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>Batal</Button>
            <Button onClick={() => { update("status", "published"); handleSave(); }}>
              <Save className="w-4 h-4 mr-2" /> Publikasi
            </Button>
          </div>
        </div>
      </div>
    </div>
    </Portal>
  );
}
