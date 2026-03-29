"use client";

import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MapPin, Plus, Star, Loader2 } from "lucide-react";
import type { Address } from "./types";
import { getAddresses } from "@/lib/actions/address-actions";
import { AddressForm } from "./AddressForm";

interface AddressSelectorProps {
    selectedId: string | null;
    onSelect: (id: string) => void;
}

export function AddressSelector({ selectedId, onSelect }: AddressSelectorProps) {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    const fetchAddresses = useCallback(async () => {
        const addrs = await getAddresses();
        const mapped: Address[] = addrs.map((a) => ({
            id: a.id,
            label: a.label,
            recipient_name: a.recipientName,
            phone: a.phone,
            address_line_1: a.streetAddress,
            address_line_2: a.district || undefined,
            city: a.city,
            province: a.province,
            postal_code: a.postalCode,
            is_default: a.isDefault,
        }));
        setAddresses(mapped);
        setIsLoading(false);
    }, []);

    useEffect(() => { fetchAddresses(); }, [fetchAddresses]);

    useEffect(() => {
        if (!selectedId && addresses.length > 0) {
            const defaultAddr = addresses.find((a) => a.is_default);
            if (defaultAddr) onSelect(defaultAddr.id);
        }
    }, [selectedId, addresses, onSelect]);

    const handleAddressCreated = async (addressId: string) => {
        setShowForm(false);
        await fetchAddresses();
        onSelect(addressId);
    };

    if (isLoading) return <div className="py-8 text-center"><Loader2 className="w-6 h-6 mx-auto animate-spin text-muted-foreground" /></div>;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold flex items-center gap-2"><MapPin className="w-5 h-5" />Alamat Pengiriman</h3>
                {!showForm && <Button variant="outline" size="sm" onClick={() => setShowForm(true)}><Plus className="w-4 h-4 mr-1" />Tambah</Button>}
            </div>
            {showForm && <Card className="p-4"><AddressForm onSuccess={handleAddressCreated} onCancel={() => setShowForm(false)} /></Card>}
            {addresses.length === 0 && !showForm ? (
                <Card className="p-6 text-center">
                    <MapPin className="w-10 h-10 mx-auto mb-3 text-muted-foreground/50" />
                    <p className="text-muted-foreground mb-4">Anda belum memiliki alamat tersimpan</p>
                    <Button onClick={() => setShowForm(true)}><Plus className="w-4 h-4 mr-2" />Tambah Alamat</Button>
                </Card>
            ) : (
                <RadioGroup value={selectedId || ""} onValueChange={onSelect}>
                    <div className="grid gap-3">
                        {addresses.map((address) => (
                            <Card key={address.id} className={`p-4 cursor-pointer transition-all hover:border-primary ${selectedId === address.id ? "border-primary bg-primary/5 ring-1 ring-primary" : ""}`} onClick={() => onSelect(address.id)}>
                                <div className="flex items-start gap-3">
                                    <RadioGroupItem value={address.id} id={address.id} className="mt-1" />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-medium">{address.label}</span>
                                            {address.is_default && <Badge variant="secondary" className="text-xs"><Star className="w-3 h-3 mr-1 fill-current" />Utama</Badge>}
                                        </div>
                                        <p className="text-sm text-muted-foreground">{address.recipient_name} • {address.phone}</p>
                                        <p className="text-sm mt-1">{address.address_line_1}{address.address_line_2 && `, ${address.address_line_2}`}</p>
                                        <p className="text-sm text-muted-foreground">{address.city}, {address.province} {address.postal_code}</p>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </RadioGroup>
            )}
        </div>
    );
}
