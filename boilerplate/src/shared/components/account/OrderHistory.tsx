"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import {
    Package, ChevronRight, Clock, CreditCard, Truck, CheckCircle2,
    XCircle, RotateCcw, AlertCircle,
} from "lucide-react";
import { getOrders } from "@/shared/lib/actions/order-actions";
import { formatPrice } from "@/shared/lib/utils/format";
import { EmptyOrders } from "@/shared/components/ui/empty-states";
import { OrderCardSkeleton } from "@/shared/components/ui/skeletons";
import type { OrderStatus, PaymentStatus } from "@/shared/types/ecommerce";

interface OrderData {
    id: string;
    orderNumber: string;
    status: string;
    paymentStatus: string;
    shippingMethod: string | null;
    trackingNumber: string | null;
    totalAmount: number;
    createdAt: Date;
    items: { id: string }[];
}

const formatDate = (date: Date) =>
    new Date(date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

const getStatusConfig = (status: OrderStatus) => {
    switch (status) {
        case "pending": return { label: "Menunggu Pembayaran", variant: "outline" as const, icon: Clock, color: "text-amber-500" };
        case "paid": return { label: "Dibayar", variant: "default" as const, icon: CreditCard, color: "text-blue-500" };
        case "processing": return { label: "Diproses", variant: "default" as const, icon: Package, color: "text-blue-500" };
        case "shipped": return { label: "Dikirim", variant: "default" as const, icon: Truck, color: "text-indigo-500" };
        case "delivered": return { label: "Terkirim", variant: "default" as const, icon: CheckCircle2, color: "text-emerald-500" };
        case "completed": return { label: "Selesai", variant: "secondary" as const, icon: CheckCircle2, color: "text-emerald-500" };
        case "cancelled": return { label: "Dibatalkan", variant: "destructive" as const, icon: XCircle, color: "text-destructive" };
        case "returned": return { label: "Dikembalikan", variant: "destructive" as const, icon: RotateCcw, color: "text-destructive" };
        default: return { label: status, variant: "outline" as const, icon: AlertCircle, color: "text-muted-foreground" };
    }
};

const getPaymentStatusBadge = (status: PaymentStatus) => {
    switch (status) {
        case "paid": return { label: "Lunas", variant: "default" as const };
        case "pending": return { label: "Pending", variant: "outline" as const };
        case "unpaid": return { label: "Belum Bayar", variant: "destructive" as const };
        case "failed": return { label: "Gagal", variant: "destructive" as const };
        case "refunded": return { label: "Refund", variant: "secondary" as const };
        default: return { label: status, variant: "outline" as const };
    }
};

function OrderCard({ order }: { order: OrderData }) {
    const statusConfig = getStatusConfig(order.status as OrderStatus);
    const paymentBadge = getPaymentStatusBadge(order.paymentStatus as PaymentStatus);
    const StatusIcon = statusConfig.icon;

    return (
        <Card className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
                <div>
                    <p className="font-mono text-sm font-medium">{order.orderNumber}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{formatDate(order.createdAt)}</p>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant={paymentBadge.variant} className="text-xs">{paymentBadge.label}</Badge>
                    <Badge variant={statusConfig.variant} className="text-xs gap-1">
                        <StatusIcon className={`w-3 h-3 ${statusConfig.color}`} />
                        {statusConfig.label}
                    </Badge>
                </div>
            </div>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-lg font-semibold">IDR {formatPrice(order.totalAmount)}</p>
                    <p className="text-xs text-muted-foreground">{order.shippingMethod || "Standard Shipping"}</p>
                </div>
                <Button variant="ghost" size="sm" asChild>
                    <Link href={`/account/orders/${order.id}`}>
                        Detail <ChevronRight className="w-4 h-4 ml-1" />
                    </Link>
                </Button>
            </div>
            {order.trackingNumber && (
                <div className="mt-3 pt-3 border-t border-border">
                    <p className="text-xs text-muted-foreground">
                        No. Resi: <span className="font-mono font-medium text-foreground">{order.trackingNumber}</span>
                    </p>
                </div>
            )}
        </Card>
    );
}

export function OrderHistory() {
    const [orders, setOrders] = useState<OrderData[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getOrders().then((data) => { setOrders(data as unknown as OrderData[]); setIsLoading(false); });
    }, []);

    if (isLoading) return (
        <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => <OrderCardSkeleton key={i} />)}
        </div>
    );

    if (orders.length === 0) return <EmptyOrders />;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="font-semibold text-lg">Riwayat Pesanan</h2>
                <p className="text-sm text-muted-foreground">{orders.length} pesanan</p>
            </div>
            <div className="space-y-3">
                {orders.map((order) => <OrderCard key={order.id} order={order} />)}
            </div>
        </div>
    );
}
