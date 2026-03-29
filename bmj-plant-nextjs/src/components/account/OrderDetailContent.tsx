"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
    ArrowLeft, Package, MapPin, Truck, CreditCard, Clock,
    CheckCircle2, XCircle, RotateCcw, AlertCircle, Copy, Check, Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { getOrderDetail } from "@/lib/actions/order-actions";
import { formatPrice } from "@/lib/utils/format";
import type { OrderStatus } from "@/types/ecommerce";

interface OrderDetailData {
    id: string; orderNumber: string; status: string; paymentStatus: string;
    shippingMethod: string | null; trackingNumber: string | null;
    subtotal: number; shippingCost: number; discount: number; totalAmount: number;
    createdAt: Date;
    address: { label: string; recipientName: string; phone: string; addressLine1: string; addressLine2: string | null; city: string; province: string; postalCode: string; } | null;
    items: { id: string; plantId: string | null; plantName: string; plantImage: string | null; quantity: number; unitPrice: number; subtotal: number; }[];
    statusHistory: { id: string; status: string; notes: string | null; createdAt: Date; }[];
}

const formatDate = (date: Date) => new Date(date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });

const statusSteps: OrderStatus[] = ["pending", "paid", "processing", "shipped", "delivered", "completed"];

const getStatusConfig = (status: OrderStatus) => {
    const map: Record<OrderStatus, { label: string; color: string; icon: typeof Clock }> = {
        pending: { label: "Menunggu Pembayaran", color: "text-amber-500", icon: Clock },
        paid: { label: "Dibayar", color: "text-blue-500", icon: CreditCard },
        processing: { label: "Diproses", color: "text-blue-500", icon: Package },
        shipped: { label: "Dikirim", color: "text-indigo-500", icon: Truck },
        delivered: { label: "Terkirim", color: "text-emerald-500", icon: CheckCircle2 },
        completed: { label: "Selesai", color: "text-emerald-500", icon: CheckCircle2 },
        cancelled: { label: "Dibatalkan", color: "text-destructive", icon: XCircle },
        returned: { label: "Dikembalikan", color: "text-destructive", icon: RotateCcw },
    };
    return map[status] || { label: status, color: "text-muted-foreground", icon: AlertCircle };
};

interface OrderDetailContentProps { orderId: string; }

const OrderDetailContent = ({ orderId }: OrderDetailContentProps) => {
    const router = useRouter();
    const [copiedTracking, setCopiedTracking] = useState(false);
    const [order, setOrder] = useState<OrderDetailData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getOrderDetail(orderId).then((data) => { setOrder(data as unknown as OrderDetailData | null); setIsLoading(false); });
    }, [orderId]);

    const copyTracking = () => {
        if (order?.trackingNumber) {
            navigator.clipboard.writeText(order.trackingNumber);
            setCopiedTracking(true);
            toast.success("Nomor resi disalin");
            setTimeout(() => setCopiedTracking(false), 2000);
        }
    };

    if (isLoading) return <div className="py-12 text-center"><Loader2 className="w-8 h-8 mx-auto animate-spin text-muted-foreground" /></div>;

    if (!order) {
        return (
            <div className="text-center py-12">
                <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
                <h2 className="text-lg font-semibold mb-2">Pesanan tidak ditemukan</h2>
                <Button variant="outline" asChild>
                    <Link href="/account?tab=orders"><ArrowLeft className="w-4 h-4 mr-2" />Kembali ke Pesanan</Link>
                </Button>
            </div>
        );
    }

    const statusConfig = getStatusConfig(order.status as OrderStatus);
    const isCancelled = order.status === "cancelled" || order.status === "returned";
    const currentStepIndex = statusSteps.indexOf(order.status as OrderStatus);
    const items = order.items;
    const history = order.statusHistory;

    return (
        <div className="max-w-[1000px] mx-auto px-4 py-6">
            <div className="mt-4 mb-6 flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.push("/account?tab=orders")}><ArrowLeft className="w-5 h-5" /></Button>
                <div>
                    <h1 className="font-serif text-xl md:text-2xl font-bold flex items-center gap-3">{order.orderNumber}</h1>
                    <p className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</p>
                </div>
            </div>

            {!isCancelled && (
                <Card className="mb-6">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between overflow-x-auto pb-2">
                            {statusSteps.slice(0, -1).map((step, i) => {
                                const config = getStatusConfig(step);
                                const Icon = config.icon;
                                const isActive = i <= currentStepIndex;
                                const isCurrent = step === order.status;
                                return (
                                    <div key={step} className="flex items-center flex-1 last:flex-none">
                                        <div className="flex flex-col items-center min-w-[60px]">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${isCurrent ? "border-primary bg-primary text-primary-foreground" : isActive ? "border-primary bg-primary/10 text-primary" : "border-muted text-muted-foreground"}`}>
                                                <Icon className="w-5 h-5" />
                                            </div>
                                            <span className={`text-xs mt-2 text-center whitespace-nowrap ${isCurrent ? "font-semibold text-primary" : "text-muted-foreground"}`}>{config.label}</span>
                                        </div>
                                        {i < statusSteps.length - 2 && <div className={`h-0.5 flex-1 mx-2 ${i < currentStepIndex ? "bg-primary" : "bg-muted"}`} />}
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            )}

            {isCancelled && (
                <Card className="mb-6 border-destructive/30 bg-destructive/5">
                    <CardContent className="p-4 flex items-center gap-3">
                        <statusConfig.icon className={`w-6 h-6 ${statusConfig.color}`} />
                        <div><p className="font-semibold">{statusConfig.label}</p><p className="text-sm text-muted-foreground">Pesanan ini telah dibatalkan</p></div>
                    </CardContent>
                </Card>
            )}

            {order.trackingNumber && (
                <Card className="mb-6 border-primary/30 bg-primary/5">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Truck className="w-5 h-5 text-primary" />
                            <div><p className="text-sm text-muted-foreground">No. Resi</p><p className="font-mono font-bold">{order.trackingNumber}</p></div>
                        </div>
                        <Button variant="outline" size="sm" onClick={copyTracking}>{copiedTracking ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}</Button>
                    </CardContent>
                </Card>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Package className="w-5 h-5" />Item Pesanan ({items.length})</CardTitle></CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {items.map((item) => (
                                    <div key={item.id} className="flex gap-4 py-3 border-b border-border last:border-0">
                                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                                            {item.plantImage ? <Image src={item.plantImage} alt={item.plantName} width={64} height={64} className="object-cover" /> : <div className="w-full h-full flex items-center justify-center"><Package className="w-6 h-6 text-muted-foreground/50" /></div>}
                                        </div>
                                        <div className="flex-1">
                                            {item.plantId ? <Link href={`/product/${item.plantId}`} className="font-medium hover:text-primary">{item.plantName}</Link> : <p className="font-medium">{item.plantName}</p>}
                                            <p className="text-sm text-muted-foreground">{item.quantity}x @ IDR {formatPrice(item.unitPrice)}</p>
                                        </div>
                                        <p className="font-semibold">IDR {formatPrice(item.subtotal)}</p>
                                    </div>
                                ))}
                            </div>
                            <Separator className="my-4" />
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>IDR {formatPrice(order.subtotal)}</span></div>
                                <div className="flex justify-between"><span className="text-muted-foreground">Ongkos Kirim</span><span>IDR {formatPrice(order.shippingCost)}</span></div>
                                {order.discount > 0 && <div className="flex justify-between text-emerald-600"><span>Diskon</span><span>-IDR {formatPrice(order.discount)}</span></div>}
                                <Separator />
                                <div className="flex justify-between font-semibold text-lg"><span>Total</span><span className="text-primary">IDR {formatPrice(order.totalAmount)}</span></div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    {order.address && (
                        <Card>
                            <CardHeader><CardTitle className="text-base flex items-center gap-2"><MapPin className="w-5 h-5" />Alamat Pengiriman</CardTitle></CardHeader>
                            <CardContent>
                                <div className="space-y-1 text-sm">
                                    <p className="font-medium">{order.address.label}</p>
                                    <p>{order.address.recipientName} • {order.address.phone}</p>
                                    <p className="text-muted-foreground">{order.address.addressLine1}{order.address.addressLine2 && `, ${order.address.addressLine2}`}</p>
                                    <p className="text-muted-foreground">{order.address.city}, {order.address.province} {order.address.postalCode}</p>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                    <Card>
                        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Clock className="w-5 h-5" />Riwayat Pesanan</CardTitle></CardHeader>
                        <CardContent>
                            {history.length === 0 ? <p className="text-sm text-muted-foreground text-center py-4">Belum ada riwayat</p> : (
                                <div className="space-y-0">
                                    {history.map((entry, i) => {
                                        const entryConfig = getStatusConfig(entry.status as OrderStatus);
                                        const EntryIcon = entryConfig.icon;
                                        const isLatest = i === history.length - 1;
                                        return (
                                            <div key={entry.id} className="flex gap-3 text-sm relative">
                                                <div className="flex flex-col items-center">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${isLatest ? "border-primary bg-primary text-primary-foreground" : "border-muted bg-muted/50 text-muted-foreground"}`}>
                                                        <EntryIcon className="w-4 h-4" />
                                                    </div>
                                                    {i < history.length - 1 && <div className="w-px flex-1 bg-border min-h-[24px]" />}
                                                </div>
                                                <div className="pb-5 pt-1">
                                                    <p className={`font-medium ${isLatest ? "text-primary" : ""}`}>{entryConfig.label}</p>
                                                    {entry.notes && <p className="text-xs text-muted-foreground mt-0.5">{entry.notes}</p>}
                                                    <p className="text-xs text-muted-foreground mt-1">{formatDate(entry.createdAt)}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailContent;
