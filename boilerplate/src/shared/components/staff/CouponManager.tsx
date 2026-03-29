"use client";

import { useState, useEffect, useCallback } from "react";
import { Portal } from "@/shared/components/ui/portal";
import { useOverlay } from "@/shared/hooks/useOverlay";
import { Plus, X, Ticket, Percent, Tag, Truck, ToggleLeft, ToggleRight, Save } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { toast } from "sonner";
import { formatRupiah } from "@/shared/lib/utils/format";
import { fetchCoupons, toggleCouponActive } from "@/shared/lib/actions/admin-actions";
import type { AdminCoupon } from "@/shared/types/coupon";

const typeLabel: Record<AdminCoupon["type"], { label: string; icon: typeof Percent }> = {
  percentage: { label: "Persentase", icon: Percent },
  fixed: { label: "Nominal", icon: Tag },
  free_shipping: { label: "Gratis Ongkir", icon: Truck },
};

export function CouponManager() {
  const [coupons, setCoupons] = useState<AdminCoupon[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await fetchCoupons();
      setCoupons(data);
      setIsLoading(false);
    }
    load();
  }, []);

  const handleToggleActive = async (id: string) => {
    const result = await toggleCouponActive(id);
    if (result.success) {
      setCoupons(prev => prev.map(c => c.id === id ? { ...c, isActive: !c.isActive } : c));
      toast.success("Status kupon diubah");
    } else {
      toast.error(result.error || "Gagal mengubah status kupon");
    }
  };

  const handleEdit = (coupon: AdminCoupon) => {
    setEditId(coupon.id);
    setShowForm(true);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center py-20"><span className="material-symbols-outlined animate-spin text-brand-dark/30">progress_activity</span></div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">{coupons.length} kupon</p>
        <Button size="sm" onClick={() => { setEditId(null); setShowForm(true); }}>
          <Plus className="w-4 h-4 mr-1.5" /> Buat Kupon
        </Button>
      </div>

      {/* Coupon Table */}
      <div className="bg-background rounded-xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Kode</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Tipe</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Nilai</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Min. Order</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground">Penggunaan</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Kadaluarsa</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground">Status</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map(c => {
                const expired = new Date(c.expiresAt) < new Date();
                const TypeIcon = typeLabel[c.type].icon;
                return (
                  <tr key={c.id} className="border-t hover:bg-muted/20">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Ticket className="w-4 h-4 text-muted-foreground" />
                        <span className="font-mono font-semibold text-xs">{c.code}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 text-xs">
                        <TypeIcon className="w-3 h-3" />
                        {typeLabel[c.type].label}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-xs">
                      {c.type === "percentage" ? `${c.value}%` : c.type === "fixed" ? formatRupiah(c.value) : "—"}
                    </td>
                    <td className="px-4 py-3 text-xs">{formatRupiah(c.minOrder)}</td>
                    <td className="px-4 py-3 text-center text-xs">
                      <span className={c.usageCount >= c.usageLimit ? "text-destructive font-semibold" : ""}>
                        {c.usageCount}/{c.usageLimit}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs">
                      <span className={expired ? "text-destructive" : "text-muted-foreground"}>
                        {new Date(c.expiresAt).toLocaleDateString("id-ID")}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => handleToggleActive(c.id)}>
                        {c.isActive ? (
                          <ToggleRight className="w-6 h-6 text-emerald-500" />
                        ) : (
                          <ToggleLeft className="w-6 h-6 text-muted-foreground" />
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="ghost" size="xs" onClick={() => handleEdit(c)}>Edit</Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Form Modal */}
      {showForm && (
        <CouponForm
          coupon={editId ? coupons.find(c => c.id === editId) : undefined}
          onClose={() => setShowForm(false)}
          onSave={(data) => {
            if (editId) {
              setCoupons(prev => prev.map(c => c.id === editId ? { ...c, ...data } : c));
            } else {
              setCoupons(prev => [...prev, { ...data, id: `c${Date.now()}`, usageCount: 0, isActive: true }]);
            }
            setShowForm(false);
          }}
        />
      )}
    </div>
  );
}

function CouponForm({ coupon, onClose, onSave }: {
  coupon?: AdminCoupon;
  onClose: () => void;
  onSave: (data: Omit<AdminCoupon, "id" | "usageCount" | "isActive">) => void;
}) {
  const stableClose = useCallback(() => onClose(), [onClose]);
  useOverlay(true, stableClose);

  const [code, setCode] = useState(coupon?.code || "");
  const [type, setType] = useState<AdminCoupon["type"]>(coupon?.type || "percentage");
  const [value, setValue] = useState(coupon?.value || 0);
  const [minOrder, setMinOrder] = useState(coupon?.minOrder || 0);
  const [maxDiscount, setMaxDiscount] = useState(coupon?.maxDiscount || 0);
  const [usageLimit, setUsageLimit] = useState(coupon?.usageLimit || 50);
  const [expiresAt, setExpiresAt] = useState(coupon?.expiresAt || "2025-12-31");

  const handleSave = () => {
    if (!code.trim()) { toast.error("Kode kupon wajib diisi"); return; }
    onSave({ code: code.toUpperCase(), type, value, minOrder, maxDiscount: maxDiscount || null, usageLimit, expiresAt });
    toast.success(coupon ? "Kupon berhasil diupdate!" : "Kupon berhasil dibuat!");
  };

  return (
    <Portal>
    <div className="fixed top-0 left-0 w-screen z-[100] flex items-center justify-center p-4" style={{ height: '100dvh' }}>
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-md bg-background rounded-xl shadow-2xl max-h-[90dvh] overflow-y-auto">
        <div className="border-b px-5 py-4 flex items-center justify-between">
          <h3 className="font-bold">{coupon ? "Edit Kupon" : "Buat Kupon Baru"}</h3>
          <Button variant="ghost" size="icon" onClick={onClose}><X className="w-5 h-5" /></Button>
        </div>
        <div className="p-5 space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Kode Kupon</Label>
            <Input value={code} onChange={e => setCode(e.target.value.toUpperCase())} placeholder="WELCOME10" className="font-mono" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Tipe</Label>
              <Select value={type} onValueChange={v => setType(v as AdminCoupon["type"])}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Persentase (%)</SelectItem>
                  <SelectItem value="fixed">Nominal (Rp)</SelectItem>
                  <SelectItem value="free_shipping">Gratis Ongkir</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">{type === "percentage" ? "Diskon (%)" : "Nilai (Rp)"}</Label>
              <Input type="number" value={value || ""} onChange={e => setValue(Number(e.target.value))} disabled={type === "free_shipping"} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Min. Order (Rp)</Label>
              <Input type="number" value={minOrder || ""} onChange={e => setMinOrder(Number(e.target.value))} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Max Diskon (Rp)</Label>
              <Input type="number" value={maxDiscount || ""} onChange={e => setMaxDiscount(Number(e.target.value))} disabled={type !== "percentage"} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Batas Penggunaan</Label>
              <Input type="number" value={usageLimit} onChange={e => setUsageLimit(Number(e.target.value))} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Kadaluarsa</Label>
              <Input type="date" value={expiresAt} onChange={e => setExpiresAt(e.target.value)} />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={onClose}>Batal</Button>
            <Button className="flex-1" onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" /> Simpan
            </Button>
          </div>
        </div>
      </div>
    </div>
    </Portal>
  );
}
