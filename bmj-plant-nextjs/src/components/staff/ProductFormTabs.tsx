"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Image from "next/image";
import { Portal } from "@/components/ui/portal";
import { useOverlay } from "@/hooks/useOverlay";
import { X, Upload, Trash2, Save, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { createProductAction, updateProductAction } from "@/lib/actions/product-admin-actions";
import { fetchProductFormData } from "@/lib/actions/admin-actions";
import type { ProductSpecs } from "@/types/product";

// ── Types ──

interface CategoryOption { id: string; name: string; slug: string }
interface ExpertOption { id: string; shortName: string; title: string; user: { name: string | null } }

interface ProductEditData {
  id: string;
  slug: string;
  sku: string | null;
  name: string;
  scientificName: string | null;
  description: string;
  price: number;
  compareAtPrice: number | null;
  discountPct: number;
  stock: number;
  careDifficulty: number;
  sizeOptions: unknown;
  labels: unknown;
  specs: unknown;
  faqs: unknown;
  isActive: boolean;
  categoryId: string;
  curatorId: string | null;
  images: { id: string; url: string; alt: string; sortOrder: number }[];
  category: { id: string; name: string; slug: string };
  curator: { id: string; shortName: string; user: { name: string } } | null;
}

interface Props {
  editData?: ProductEditData;
  onClose: () => void;
  onSaved?: () => void;
}

type Tab = "general" | "media" | "plant" | "content";

const TABS: { key: Tab; label: string; icon: string }[] = [
  { key: "general", label: "Umum", icon: "info" },
  { key: "media", label: "Media", icon: "image" },
  { key: "plant", label: "Tanaman", icon: "eco" },
  { key: "content", label: "Konten", icon: "article" },
];

const CARE_LEVELS = [
  { value: "1", label: "1 — Sangat Mudah" },
  { value: "2", label: "2 — Mudah" },
  { value: "3", label: "3 — Sedang" },
  { value: "4", label: "4 — Sulit" },
  { value: "5", label: "5 — Sangat Sulit" },
];

export function ProductFormTabs({ editData, onClose, onSaved }: Props) {
  const stableClose = useCallback(() => onClose(), [onClose]);
  useOverlay(true, stableClose);

  const isEdit = !!editData?.id;
  const [activeTab, setActiveTab] = useState<Tab>("general");
  const [saving, setSaving] = useState(false);

  // ── Dropdown data ──
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [experts, setExperts] = useState<ExpertOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProductFormData().then(data => {
      setCategories(data.categories);
      setExperts(data.experts);
      setLoading(false);
    });
  }, []);

  // ── Form state — General ──
  const [name, setName] = useState(editData?.name || "");
  const [sku, setSku] = useState(editData?.sku || "");
  const [categoryId, setCategoryId] = useState(editData?.categoryId || "");
  const [scientificName, setScientificName] = useState(editData?.scientificName || "");
  const [price, setPrice] = useState(editData?.price || 0);
  const [compareAtPrice, setCompareAtPrice] = useState(editData?.compareAtPrice || 0);
  const [discountPct, setDiscountPct] = useState(editData?.discountPct || 0);
  const [stock, setStock] = useState(editData?.stock || 0);
  const [isActive, setIsActive] = useState(editData?.isActive ?? true);
  const [description, setDescription] = useState(editData?.description || "");
  const [sizeOptions, setSizeOptions] = useState<string[]>(
    (editData?.sizeOptions as string[]) || []
  );
  const [labels, setLabels] = useState<string[]>(
    (editData?.labels as string[]) || []
  );

  // ── Form state — Media ──
  const [images, setImages] = useState<{ url: string; alt: string }[]>(
    editData?.images?.map(i => ({ url: i.url, alt: i.alt })) || []
  );
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Form state — Plant & Care ──
  const existingSpecs = (editData?.specs || {}) as Partial<ProductSpecs>;
  const [careDifficulty, setCareDifficulty] = useState(editData?.careDifficulty || 2);
  const [light, setLight] = useState(existingSpecs.light || "");
  const [water, setWater] = useState(existingSpecs.water || "");
  const [soil, setSoil] = useState(existingSpecs.soil || "");
  const [humidity, setHumidity] = useState(existingSpecs.humidity || "");
  const [temperature, setTemperature] = useState(existingSpecs.temperature || "");
  const [toxicity, setToxicity] = useState(existingSpecs.toxicity || "");
  const [growthRate, setGrowthRate] = useState(existingSpecs.growthRate || "");
  const [height, setHeight] = useState(existingSpecs.height || "");
  const [potSize, setPotSize] = useState(existingSpecs.potSize || "");
  const [careTips, setCareTips] = useState(existingSpecs.careTips || "");
  const [handling, setHandling] = useState(existingSpecs.handling || "");
  const [originRegionsStr, setOriginRegionsStr] = useState(
    (existingSpecs.originRegions || []).join(", ")
  );
  const [habitat, setHabitat] = useState(existingSpecs.habitat || "");
  const [packagingType, setPackagingType] = useState(existingSpecs.packagingType || "");

  // ── Form state — Content ──
  const [curatorId, setCuratorId] = useState(editData?.curatorId || "");
  const existingFaqs = (editData?.faqs as { q: string; a: string }[]) || [];
  const [faqs, setFaqs] = useState(existingFaqs);

  // ── Image upload ──
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("bucket", "products");
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!data.success) {
        toast.error(data.error || "Upload gagal");
        return;
      }
      setImages(prev => [...prev, { url: data.url, alt: name || "Product image" }]);
      toast.success("Gambar berhasil diupload");
    } catch {
      toast.error("Upload gagal. Coba lagi.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // ── Save ──
  const handleSave = async () => {
    if (!name || !sku || !categoryId) {
      toast.error("Nama, SKU, dan Kategori wajib diisi");
      setActiveTab("general");
      return;
    }
    if (!light || !water || !soil || !humidity || !temperature || !toxicity) {
      toast.error("Semua spesifikasi perawatan dasar wajib diisi");
      setActiveTab("plant");
      return;
    }

    setSaving(true);
    const formData = {
      name,
      sku,
      categoryId,
      scientificName,
      price,
      compareAtPrice: compareAtPrice || undefined,
      discountPct,
      stock,
      careDifficulty,
      description,
      sizeOptions,
      labels,
      specs: {
        light, water, soil, humidity, temperature, toxicity,
        ...(growthRate && { growthRate }),
        ...(height && { height }),
        ...(potSize && { potSize }),
        ...(careTips && { careTips }),
        ...(handling && { handling }),
        ...(originRegionsStr && {
          originRegions: originRegionsStr.split(",").map(s => s.trim()).filter(Boolean),
        }),
        ...(habitat && { habitat }),
        ...(packagingType && { packagingType }),
      },
      faqs,
      curatorId: curatorId || undefined,
      isActive,
    };

    try {
      const result = isEdit
        ? await updateProductAction(editData!.id, formData, images)
        : await createProductAction(formData, images);

      if (result.success) {
        toast.success(isEdit ? "Produk berhasil diupdate!" : "Produk berhasil dibuat!");
        onSaved?.();
        onClose();
      } else {
        toast.error(result.error);
      }
    } catch {
      toast.error("Terjadi kesalahan. Coba lagi.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Portal>
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative bg-background rounded-xl p-8">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        </div>
      </Portal>
    );
  }

  return (
    <Portal>
      <div className="fixed top-0 left-0 w-screen z-[100] flex items-center justify-center p-4" style={{ height: "100dvh" }}>
        <div className="absolute inset-0 bg-black/50" onClick={onClose} />
        <div className="relative w-full max-w-3xl bg-background rounded-xl shadow-2xl overflow-hidden flex flex-col" style={{ maxHeight: "90dvh" }}>

          {/* Header */}
          <div className="sticky top-0 bg-background border-b px-5 py-4 flex items-center justify-between z-10">
            <h2 className="font-bold text-lg">{isEdit ? "Edit Produk" : "Tambah Produk Baru"}</h2>
            <Button variant="ghost" size="icon" onClick={onClose}><X className="w-5 h-5" /></Button>
          </div>

          {/* Tabs */}
          <div className="border-b flex px-5 bg-muted/30">
            {TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
                  activeTab === tab.key
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="material-symbols-outlined text-sm">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-5">

            {/* TAB: General */}
            {activeTab === "general" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Nama Produk *</Label>
                    <Input value={name} onChange={e => setName(e.target.value)} placeholder="Monstera Albo Variegata" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">SKU *</Label>
                    <Input value={sku} onChange={e => setSku(e.target.value)} placeholder="MON-AV-001" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Kategori *</Label>
                    <Select value={categoryId} onValueChange={setCategoryId}>
                      <SelectTrigger><SelectValue placeholder="Pilih kategori" /></SelectTrigger>
                      <SelectContent>
                        {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Nama Ilmiah</Label>
                    <Input value={scientificName} onChange={e => setScientificName(e.target.value)} placeholder="Monstera deliciosa 'Albo'" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Harga (Rp)</Label>
                    <Input type="number" value={price || ""} onChange={e => setPrice(Number(e.target.value))} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Harga Coret (Rp)</Label>
                    <Input type="number" value={compareAtPrice || ""} onChange={e => setCompareAtPrice(Number(e.target.value))} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Diskon (%)</Label>
                    <Input type="number" min={0} max={100} value={discountPct || ""} onChange={e => setDiscountPct(Number(e.target.value))} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Stok</Label>
                    <Input type="number" min={0} value={stock || ""} onChange={e => setStock(Number(e.target.value))} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Deskripsi *</Label>
                  <Textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} placeholder="Deskripsi lengkap produk..." />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Ukuran Tersedia</Label>
                    <Input
                      value={sizeOptions.join(", ")}
                      onChange={e => setSizeOptions(e.target.value.split(",").map(s => s.trim()).filter(Boolean))}
                      placeholder="S, M, L atau S (3 Daun), M (5 Daun)"
                    />
                    <p className="text-2xs text-muted-foreground">Pisahkan dengan koma</p>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Label</Label>
                    <Input
                      value={labels.join(", ")}
                      onChange={e => setLabels(e.target.value.split(",").map(s => s.trim()).filter(Boolean))}
                      placeholder="Rare, Variegated, New Arrival"
                    />
                    <p className="text-2xs text-muted-foreground">Pisahkan dengan koma</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={isActive}
                    onChange={e => setIsActive(e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor="isActive" className="text-xs">Produk aktif (tampil di toko)</Label>
                </div>
              </div>
            )}

            {/* TAB: Media */}
            {activeTab === "media" && (
              <div className="space-y-4">
                <p className="text-xs text-muted-foreground">Upload foto produk. Foto pertama akan menjadi hero image.</p>
                <div className="flex gap-3 flex-wrap">
                  {images.map((img, i) => (
                    <div key={i} className="relative w-24 h-24 rounded-lg bg-muted border overflow-hidden group">
                      <Image src={img.url} alt={img.alt} width={96} height={96} className="object-cover w-full h-full" />
                      <div className="absolute top-1 left-1 bg-black/60 text-white text-2xs px-1.5 py-0.5 rounded">{i === 0 ? "Hero" : i + 1}</div>
                      <button
                        onClick={() => setImages(prev => prev.filter((_, j) => j !== i))}
                        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                      >
                        <Trash2 className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  ))}
                  <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleImageUpload} />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="w-24 h-24 rounded-lg border-2 border-dashed border-border hover:border-primary/50 flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-primary transition-colors disabled:opacity-50"
                  >
                    <Upload className="w-5 h-5" />
                    <span className="text-2xs">{uploading ? "Loading..." : "Upload"}</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB: Plant & Care */}
            {activeTab === "plant" && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-xs font-bold mb-3 text-foreground/80">Perawatan Dasar *</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Tingkat Perawatan</Label>
                      <Select value={String(careDifficulty)} onValueChange={v => setCareDifficulty(Number(v))}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {CARE_LEVELS.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Cahaya *</Label>
                      <Input value={light} onChange={e => setLight(e.target.value)} placeholder="Bright Indirect" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Air *</Label>
                      <Input value={water} onChange={e => setWater(e.target.value)} placeholder="Moderate" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Media Tanam *</Label>
                      <Input value={soil} onChange={e => setSoil(e.target.value)} placeholder="Chunky Aroid Mix" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Kelembaban *</Label>
                      <Input value={humidity} onChange={e => setHumidity(e.target.value)} placeholder="60% - 80%" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Suhu *</Label>
                      <Input value={temperature} onChange={e => setTemperature(e.target.value)} placeholder="18°C - 28°C" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Toksisitas *</Label>
                      <Input value={toxicity} onChange={e => setToxicity(e.target.value)} placeholder="Toxic to Pets" />
                    </div>
                  </div>
                </div>

                <hr />

                <div>
                  <h3 className="text-xs font-bold mb-3 text-foreground/80">Detail Tambahan (Opsional)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Tinggi Tanaman</Label>
                      <Input value={height} onChange={e => setHeight(e.target.value)} placeholder="40-60cm" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Ukuran Pot</Label>
                      <Input value={potSize} onChange={e => setPotSize(e.target.value)} placeholder="20cm" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Kecepatan Tumbuh</Label>
                      <Select value={growthRate} onValueChange={setGrowthRate}>
                        <SelectTrigger><SelectValue placeholder="Pilih" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Lambat">Lambat</SelectItem>
                          <SelectItem value="Sedang">Sedang</SelectItem>
                          <SelectItem value="Cepat">Cepat</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Kemasan Pengiriman</Label>
                      <Select value={packagingType} onValueChange={setPackagingType}>
                        <SelectTrigger><SelectValue placeholder="Pilih" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="BARE_ROOT">Bare Root</SelectItem>
                          <SelectItem value="POTTED">Potted</SelectItem>
                          <SelectItem value="TISSUE_CULTURE">Tissue Culture</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5 md:col-span-2">
                      <Label className="text-xs font-semibold">Asal Geografis</Label>
                      <Input value={originRegionsStr} onChange={e => setOriginRegionsStr(e.target.value)} placeholder="Kolombia, Ekuador, Peru" />
                      <p className="text-2xs text-muted-foreground">Pisahkan dengan koma</p>
                    </div>
                    <div className="space-y-1.5 md:col-span-2">
                      <Label className="text-xs font-semibold">Habitat</Label>
                      <Input value={habitat} onChange={e => setHabitat(e.target.value)} placeholder="Hutan Hujan Tropis" />
                    </div>
                    <div className="space-y-1.5 md:col-span-2">
                      <Label className="text-xs font-semibold">Tips Perawatan</Label>
                      <Textarea value={careTips} onChange={e => setCareTips(e.target.value)} rows={2} placeholder="Bersihkan daun secara berkala..." />
                    </div>
                    <div className="space-y-1.5 md:col-span-2">
                      <Label className="text-xs font-semibold">Penanganan Khusus</Label>
                      <Input value={handling} onChange={e => setHandling(e.target.value)} placeholder="Gunakan sarung tangan saat memangkas" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: Content */}
            {activeTab === "content" && (
              <div className="space-y-5">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Kurator / Expert (E-E-A-T)</Label>
                  <Select value={curatorId} onValueChange={setCuratorId}>
                    <SelectTrigger><SelectValue placeholder="Pilih kurator" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Tidak ada</SelectItem>
                      {experts.map(e => (
                        <SelectItem key={e.id} value={e.id}>{e.user.name || e.shortName} — {e.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-2xs text-muted-foreground">Kurator yang bertanggung jawab atas deskripsi produk ini</p>
                </div>

                <hr />

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-bold text-foreground/80">FAQ</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setFaqs(prev => [...prev, { q: "", a: "" }])}
                    >
                      <Plus className="w-3 h-3 mr-1" /> Tambah FAQ
                    </Button>
                  </div>
                  {faqs.length === 0 && (
                    <p className="text-xs text-muted-foreground">Belum ada FAQ. Klik tombol untuk menambahkan.</p>
                  )}
                  {faqs.map((faq, i) => (
                    <div key={i} className="border rounded-lg p-3 mb-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs font-semibold">FAQ #{i + 1}</Label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setFaqs(prev => prev.filter((_, j) => j !== i))}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                      <Input
                        placeholder="Pertanyaan"
                        value={faq.q}
                        onChange={e => setFaqs(prev => prev.map((f, j) => j === i ? { ...f, q: e.target.value } : f))}
                      />
                      <Textarea
                        placeholder="Jawaban"
                        rows={2}
                        value={faq.a}
                        onChange={e => setFaqs(prev => prev.map((f, j) => j === i ? { ...f, a: e.target.value } : f))}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-background border-t px-5 py-3 flex gap-3">
            <Button variant="outline" className="flex-1" onClick={onClose}>Batal</Button>
            <Button className="flex-1" onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              {isEdit ? "Update Produk" : "Simpan Produk"}
            </Button>
          </div>
        </div>
      </div>
    </Portal>
  );
}
