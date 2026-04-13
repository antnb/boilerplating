"use client";



import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/shared/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { Button } from "@/shared/components/ui/button";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import type { Address, AddressFormData } from "@/shared/types/ecommerce";

const addressSchema = z.object({
    label: z.string().min(1, "Label wajib diisi"),
    recipient_name: z.string().min(1, "Nama penerima wajib diisi"),
    phone: z.string().min(10, "Nomor telepon tidak valid"),
    address_line_1: z.string().min(1, "Alamat wajib diisi"),
    address_line_2: z.string().optional(),
    city: z.string().min(1, "Kota wajib diisi"),
    province: z.string().min(1, "Provinsi wajib diisi"),
    postal_code: z.string().min(5, "Kode pos tidak valid"),
    is_default: z.boolean().optional(),
});

interface AddressFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    address?: Address | null;
    onSubmit: (data: AddressFormData) => void;
    isLoading?: boolean;
}

export function AddressFormDialog({
    open,
    onOpenChange,
    address,
    onSubmit,
    isLoading,
}: AddressFormDialogProps) {
    const isEditing = !!address;

    const form = useForm<AddressFormData>({
        resolver: zodResolver(addressSchema),
        defaultValues: {
            label: "",
            recipient_name: "",
            phone: "",
            address_line_1: "",
            address_line_2: "",
            city: "",
            province: "",
            postal_code: "",
            is_default: false,
        },
    });

    // Reset form values when dialog opens or address changes
    useEffect(() => {
        if (open) {
            form.reset({
                label: address?.label || "",
                recipient_name: address?.recipient_name || "",
                phone: address?.phone || "",
                address_line_1: address?.address_line_1 || "",
                address_line_2: address?.address_line_2 || "",
                city: address?.city || "",
                province: address?.province || "",
                postal_code: address?.postal_code || "",
                is_default: address?.is_default || false,
            });
        }
    }, [open, address, form]);

    const handleSubmit = (data: AddressFormData) => {
        onSubmit(data);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[calc(100%-2rem)] sm:max-w-md p-4 sm:p-6">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? "Edit Alamat" : "Tambah Alamat Baru"}
                    </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="label"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Label</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Rumah, Kantor, dll" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="recipient_name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nama Penerima</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Nama lengkap penerima" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nomor Telepon</FormLabel>
                                    <FormControl>
                                        <Input placeholder="08xxxxxxxxxx" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="address_line_1"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Alamat</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Nama jalan, nomor rumah, RT/RW"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="address_line_2"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Detail Alamat (Opsional)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Kelurahan, Kecamatan, dll" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="city"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Kota</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Jakarta" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="province"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Provinsi</FormLabel>
                                        <FormControl>
                                            <Input placeholder="DKI Jakarta" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="postal_code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Kode Pos</FormLabel>
                                    <FormControl>
                                        <Input placeholder="12345" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="is_default"
                            render={({ field }) => (
                                <FormItem className="flex items-center gap-2">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormLabel className="!mt-0 font-normal">
                                        Jadikan alamat utama
                                    </FormLabel>
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                            >
                                Batal
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                {isEditing ? "Simpan" : "Tambah"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
