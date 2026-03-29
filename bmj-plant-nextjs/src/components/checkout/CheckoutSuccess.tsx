"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Package, ArrowRight, Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { BANK_DETAILS } from "@/lib/constants/checkout";

interface CheckoutSuccessProps {
    orderNumber: string;
    orderId: string;
    paymentMethod?: string;
    onContinueShopping: () => void;
}

export function CheckoutSuccess({
    orderNumber,
    orderId: _orderId,
    paymentMethod,
    onContinueShopping,
}: CheckoutSuccessProps) {
    const [copied, setCopied] = useState(false);

    const copyOrderNumber = () => {
        navigator.clipboard.writeText(orderNumber);
        setCopied(true);
        toast.success("Nomor pesanan disalin");
        setTimeout(() => setCopied(false), 2000);
    };

    const bankDetails = paymentMethod ? BANK_DETAILS[paymentMethod] : null;

    return (
        <div className="max-w-lg mx-auto">
            <Card className="p-8 text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-100 flex items-center justify-center">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                </div>
                <h1 className="font-serif text-2xl font-bold mb-2">Pesanan Berhasil Dibuat!</h1>
                <p className="text-muted-foreground mb-6">Terima kasih atas pesanan Anda.</p>
                <div className="bg-muted rounded-lg p-4 mb-6">
                    <p className="text-sm text-muted-foreground mb-1">Nomor Pesanan</p>
                    <div className="flex items-center justify-center gap-2">
                        <span className="font-mono text-lg font-bold">{orderNumber}</span>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={copyOrderNumber}>
                            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                        </Button>
                    </div>
                </div>
                {bankDetails && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 text-left">
                        <h3 className="font-semibold text-amber-900 mb-2">Instruksi Pembayaran</h3>
                        <p className="text-sm text-amber-800 mb-3">Silakan transfer ke rekening berikut dalam waktu <strong>24 jam</strong>:</p>
                        <div className="bg-white rounded-md p-3 border border-amber-100">
                            <p className="font-bold text-lg">{bankDetails.bank}</p>
                            <p className="text-xl font-mono tracking-wider mt-1">{bankDetails.number}</p>
                            <p className="text-sm text-muted-foreground">a.n. {bankDetails.holder}</p>
                        </div>
                    </div>
                )}
                <div className="text-left bg-primary/5 border border-primary/20 rounded-lg p-4 mb-6">
                    <div className="flex items-start gap-3">
                        <Package className="w-5 h-5 text-primary mt-0.5" />
                        <div className="text-sm">
                            <p className="font-medium text-primary">Apa selanjutnya?</p>
                            <ul className="mt-2 space-y-1 text-muted-foreground">
                                <li>• Lakukan transfer sesuai total pesanan</li>
                                <li>• Konfirmasi pembayaran di halaman pesanan</li>
                                <li>• Pesanan akan diproses setelah pembayaran terverifikasi</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <Separator className="my-6" />
                <div className="space-y-3">
                    <Button asChild className="w-full">
                        <Link href="/account?tab=orders">Lihat Pesanan <ArrowRight className="w-4 h-4 ml-2" /></Link>
                    </Button>
                    <Button variant="outline" className="w-full" onClick={onContinueShopping}>Lanjut Belanja</Button>
                </div>
            </Card>
        </div>
    );
}
