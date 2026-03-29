"use client";

import { useState, useEffect } from "react";
import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";
import { MapPin, Edit, Trash2, Star, Plus, Loader2 } from "lucide-react";
import { AddressFormDialog } from "./AddressFormDialog";
import {
    getAddresses,
    createAddress,
    updateAddress,
    deleteAddress,
} from "@/shared/lib/actions/address-actions";
import { toast } from "sonner";
import type { Address, AddressFormData } from "@/shared/types/ecommerce";

// Map Prisma camelCase address to component snake_case
function mapAddress(a: any): Address {
    return {
        id: a.id,
        customer_id: a.customerId,
        label: a.label,
        recipient_name: a.recipientName,
        phone: a.phone,
        address_line_1: a.addressLine1 || a.streetAddress,
        address_line_2: a.addressLine2 || null,
        city: a.city,
        province: a.province,
        postal_code: a.postalCode,
        is_default: a.isDefault,
        created_at: a.createdAt?.toISOString?.() || a.createdAt,
        updated_at: a.updatedAt?.toISOString?.() || a.updatedAt,
    };
}

export function AddressList() {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showFormDialog, setShowFormDialog] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);
    const [deletingAddressId, setDeletingAddressId] = useState<string | null>(null);

    useEffect(() => {
        getAddresses().then((data) => {
            setAddresses(data.map(mapAddress));
            setIsLoading(false);
        });
    }, []);

    const handleAdd = () => {
        setEditingAddress(null);
        setShowFormDialog(true);
    };

    const handleEdit = (address: Address) => {
        setEditingAddress(address);
        setShowFormDialog(true);
    };

    const handleFormSubmit = async (data: AddressFormData) => {
        if (editingAddress) {
            const result = await updateAddress(editingAddress.id, {
                label: data.label,
                recipientName: data.recipient_name,
                phone: data.phone,
                addressLine1: data.address_line_1,
                addressLine2: data.address_line_2,
                city: data.city,
                province: data.province,
                postalCode: data.postal_code,
                isDefault: data.is_default,
            });
            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success("Alamat diperbarui");
            }
        } else {
            const result = await createAddress({
                label: data.label,
                recipientName: data.recipient_name,
                phone: data.phone,
                addressLine1: data.address_line_1,
                addressLine2: data.address_line_2,
                city: data.city,
                province: data.province,
                postalCode: data.postal_code,
                isDefault: data.is_default,
            });
            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success("Alamat ditambahkan");
            }
        }
        // Refresh addresses
        const fresh = await getAddresses();
        setAddresses(fresh.map(mapAddress));
        setShowFormDialog(false);
    };

    const handleDelete = async () => {
        if (deletingAddressId) {
            await deleteAddress(deletingAddressId);
            setAddresses((prev) => prev.filter((a) => a.id !== deletingAddressId));
            setDeletingAddressId(null);
            toast.success("Alamat dihapus");
        }
    };

    const handleSetDefault = async (id: string) => {
        await updateAddress(id, { isDefault: true });
        const fresh = await getAddresses();
        setAddresses(fresh.map(mapAddress));
        toast.success("Alamat utama diperbarui");
    };

    if (isLoading) {
        return (
            <div className="py-12 text-center">
                <Loader2 className="w-6 h-6 mx-auto animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">Alamat Pengiriman</h3>
                <Button onClick={handleAdd} size="sm" className="gap-2">
                    <Plus className="w-4 h-4" />
                    Tambah Alamat
                </Button>
            </div>

            {addresses.length === 0 ? (
                <Card className="p-8 text-center">
                    <MapPin className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                    <p className="text-muted-foreground mb-4">
                        Belum ada alamat tersimpan
                    </p>
                    <Button onClick={handleAdd}>Tambah Alamat Pertama</Button>
                </Card>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                    {addresses.map((address) => (
                        <Card key={address.id} className="p-4 relative">
                            {address.is_default && (
                                <Badge className="absolute top-3 right-3" variant="secondary">
                                    <Star className="w-3 h-3 mr-1 fill-current" />
                                    Utama
                                </Badge>
                            )}

                            <div className="pr-16">
                                <p className="font-medium">{address.label}</p>
                                <p className="text-sm text-muted-foreground mt-1">
                                    {address.recipient_name} • {address.phone}
                                </p>
                                <p className="text-sm mt-2">
                                    {address.address_line_1}
                                    {address.address_line_2 && `, ${address.address_line_2}`}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {address.city}, {address.province} {address.postal_code}
                                </p>
                            </div>

                            <div className="flex gap-2 mt-4">
                                {!address.is_default && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleSetDefault(address.id)}
                                    >
                                        Jadikan Utama
                                    </Button>
                                )}
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => handleEdit(address)}
                                >
                                    <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-destructive hover:text-destructive"
                                    onClick={() => setDeletingAddressId(address.id)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Form Dialog */}
            <AddressFormDialog
                open={showFormDialog}
                onOpenChange={setShowFormDialog}
                address={editingAddress}
                onSubmit={handleFormSubmit}
                isLoading={false}
            />

            {/* Delete Confirmation */}
            <AlertDialog
                open={!!deletingAddressId}
                onOpenChange={() => setDeletingAddressId(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Alamat</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus alamat ini? Tindakan ini tidak
                            dapat dibatalkan.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
