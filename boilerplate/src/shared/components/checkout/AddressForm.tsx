"use client";

import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import { createAddress } from "@/shared/lib/actions/address-actions";
import { toast } from "sonner";

interface AddressFormProps {
    onSuccess: (addressId: string) => void;
    onCancel: () => void;
}

export function AddressForm({ onSuccess, onCancel }: AddressFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [form, setForm] = useState({
        label: "Rumah", recipientName: "", phone: "",
        addressLine1: "", addressLine2: "", city: "", province: "", postalCode: "", isDefault: true,
    });

    const updateField = (field: string, value: string | boolean) => setForm((prev) => ({ ...prev, [field]: value }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.recipientName || !form.phone || !form.addressLine1 || !form.city || !form.province || !form.postalCode) {
            toast.error("Lengkapi semua field wajib"); return;
        }
        setIsSubmitting(true);
        const result = await createAddress({
            label: form.label, recipientName: form.recipientName, phone: form.phone,
            addressLine1: form.addressLine1, addressLine2: form.addressLine2 || undefined,
            city: form.city, province: form.province, postalCode: form.postalCode, isDefault: form.isDefault,
        });
        setIsSubmitting(false);
        if (result.error) { toast.error(result.error); return; }
        if (result.success && result.address) {
            toast.success("Alamat berhasil ditambahkan");
            onSuccess(result.address.id);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label className="text-sm font-medium mb-2 block">Label Alamat</Label>
                <div className="flex gap-2">
                    {["Rumah", "Kantor", "Lainnya"].map((l) => (
                        <Button key={l} type="button" variant={form.label === l ? "default" : "outline"} size="sm" onClick={() => updateField("label", l)}>{l}</Button>
                    ))}
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div><Label htmlFor="recipientName">Nama Penerima *</Label><Input id="recipientName" placeholder="Nama lengkap penerima" value={form.recipientName} onChange={(e) => updateField("recipientName", e.target.value)} required /></div>
                <div><Label htmlFor="phone">Nomor Telepon *</Label><Input id="phone" placeholder="08xxxxxxxxxx" value={form.phone} onChange={(e) => updateField("phone", e.target.value)} required /></div>
            </div>
            <div><Label htmlFor="addressLine1">Alamat Lengkap *</Label><Input id="addressLine1" placeholder="Jalan, nomor rumah, RT/RW" value={form.addressLine1} onChange={(e) => updateField("addressLine1", e.target.value)} required /></div>
            <div><Label htmlFor="addressLine2">Detail Tambahan</Label><Input id="addressLine2" placeholder="Lantai, unit, patokan (opsional)" value={form.addressLine2} onChange={(e) => updateField("addressLine2", e.target.value)} /></div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div><Label htmlFor="city">Kota *</Label><Input id="city" placeholder="Kota/Kabupaten" value={form.city} onChange={(e) => updateField("city", e.target.value)} required /></div>
                <div><Label htmlFor="province">Provinsi *</Label><Input id="province" placeholder="Provinsi" value={form.province} onChange={(e) => updateField("province", e.target.value)} required /></div>
                <div><Label htmlFor="postalCode">Kode Pos *</Label><Input id="postalCode" placeholder="12345" value={form.postalCode} onChange={(e) => updateField("postalCode", e.target.value)} required /></div>
            </div>
            <div className="flex items-center gap-2">
                <Checkbox id="isDefault" checked={form.isDefault} onCheckedChange={(checked) => updateField("isDefault", !!checked)} />
                <Label htmlFor="isDefault" className="text-sm cursor-pointer">Jadikan alamat utama</Label>
            </div>
            <div className="flex gap-3 pt-2">
                <Button type="submit" disabled={isSubmitting} className="flex-1">{isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}Simpan Alamat</Button>
                <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>Batal</Button>
            </div>
        </form>
    );
}
