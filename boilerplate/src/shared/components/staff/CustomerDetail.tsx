"use client";

import { useState, useEffect, useCallback } from "react";
import { Portal } from "@/shared/components/ui/portal";
import { useOverlay } from "@/shared/hooks/useOverlay";
import { X, ShoppingBag, TrendingUp, Star } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { formatRupiah } from "@/shared/lib/utils/format";
import { fetchAdminOrders } from "@/shared/lib/actions/admin-actions";
import type { OrderStatus } from "@/shared/types/order";

const statusConfig: Record<OrderStatus, { label: string; class: string }> = {
  pending: { label: "Menunggu", class: "bg-amber-100 text-amber-800" },
  processing: { label: "Diproses", class: "bg-blue-100 text-blue-800" },
  shipped: { label: "Dikirim", class: "bg-indigo-100 text-indigo-800" },
  delivered: { label: "Selesai", class: "bg-emerald-100 text-emerald-800" },
  cancelled: { label: "Dibatalkan", class: "bg-red-100 text-red-700" },
};

const tierColors: Record<string, string> = {
  Platinum: "bg-violet-100 text-violet-700 border-violet-200",
  Gold: "bg-amber-100 text-amber-700 border-amber-200",
  Silver: "bg-gray-100 text-gray-600 border-gray-200",
  Bronze: "bg-orange-100 text-orange-700 border-orange-200",
};

interface Customer {
  id: string;
  name: string;
  email: string;
  orders: number;
  totalSpent: number;
  lastOrder: string;
  tier: string;
}

type CustomerOrder = { id: string; customer: string; date: string; status: OrderStatus; total: number; items: number };

interface Props {
  customer: Customer;
  onClose: () => void;
}

export function CustomerDetail({ customer, onClose }: Props) {
  const stableClose = useCallback(() => onClose(), [onClose]);
  useOverlay(true, stableClose);

  const [customerOrders, setCustomerOrders] = useState<CustomerOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const allOrders = await fetchAdminOrders();
      const filtered = allOrders.filter(o => o.customer === customer.name);
      setCustomerOrders(filtered);
      setIsLoading(false);
    }
    load();
  }, [customer.name]);

  return (
    <Portal>
    <div className="fixed top-0 left-0 w-screen z-[100] flex justify-end" style={{ height: '100dvh' }}>
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-md bg-background shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300" style={{ height: '100%' }}>
        <div className="sticky top-0 bg-background border-b px-5 py-4 flex items-center justify-between z-10">
          <h2 className="font-bold text-lg">Detail Pelanggan</h2>
          <Button variant="ghost" size="icon" onClick={onClose}><X className="w-5 h-5" /></Button>
        </div>

        <div className="p-5 space-y-6">
          {/* Profile Card */}
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto mb-3">
              {customer.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
            </div>
            <h3 className="font-bold text-lg">{customer.name}</h3>
            <p className="text-sm text-muted-foreground">{customer.email}</p>
            <div className="mt-2">
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${tierColors[customer.tier] || "bg-muted"}`}>
                <Star className="w-3 h-3" /> {customer.tier}
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <ShoppingBag className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
              <p className="font-bold text-lg">{customer.orders}</p>
              <p className="text-2xs text-muted-foreground">Pesanan</p>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <TrendingUp className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
              <p className="font-bold text-sm">{formatRupiah(customer.totalSpent)}</p>
              <p className="text-2xs text-muted-foreground">Total Belanja</p>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <p className="font-bold text-sm mt-1">{formatRupiah(Math.round(customer.totalSpent / customer.orders))}</p>
              <p className="text-2xs text-muted-foreground mt-1">Rata-rata</p>
            </div>
          </div>

          {/* Order History */}
          <div>
            <h4 className="text-sm font-semibold mb-3">Riwayat Pesanan</h4>
            {isLoading ? (
              <div className="flex items-center justify-center py-6">
                <span className="material-symbols-outlined animate-spin text-brand-dark/30 text-sm">progress_activity</span>
              </div>
            ) : customerOrders.length > 0 ? (
              <div className="space-y-2">
                {customerOrders.map(o => (
                  <div key={o.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div>
                      <p className="font-mono text-xs">{o.id}</p>
                      <p className="text-xs text-muted-foreground">{new Date(o.date).toLocaleDateString("id-ID")}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-0.5 rounded-full text-2xs font-semibold ${statusConfig[o.status].class}`}>
                        {statusConfig[o.status].label}
                      </span>
                      <p className="text-xs font-semibold mt-1">{formatRupiah(o.total)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-6">Belum ada pesanan tercatat</p>
            )}
          </div>

          <div className="text-xs text-muted-foreground text-center">
            Member sejak {new Date(customer.lastOrder).toLocaleDateString("id-ID")}
          </div>
        </div>
      </div>
    </div>
    </Portal>
  );
}
