"use client";

import Image from "next/image";
import { useState, useCallback } from "react";
import { Portal } from "@/shared/components/ui/portal";
import { useOverlay } from "@/shared/hooks/useOverlay";
import { X, Copy, Truck, Package, CheckCircle2, Clock, FileText, User, MapPin, CreditCard, XCircle } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { toast } from "sonner";
import { formatRupiah } from "@/shared/lib/utils/format";
import { adminConfirmPaymentAction, adminRejectPaymentAction } from "@/shared/lib/actions/payment-actions";
import type { AdminOrderDetail, OrderStatus } from "@/shared/types/order";


const STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: "pending", label: "Menunggu Bayar" },
  { value: "processing", label: "Diproses" },
  { value: "shipped", label: "Dikirim" },
  { value: "delivered", label: "Selesai" },
  { value: "cancelled", label: "Dibatalkan" },
];

const statusIcon = (status: string) => {
  switch (status) {
    case "pending": return <Clock className="w-4 h-4" />;
    case "processing": return <Package className="w-4 h-4" />;
    case "shipped": return <Truck className="w-4 h-4" />;
    case "delivered": return <CheckCircle2 className="w-4 h-4" />;
    default: return <Clock className="w-4 h-4" />;
  }
};

interface Props {
  order: AdminOrderDetail;
  onClose: () => void;
  onStatusChange?: (orderId: string, newStatus: OrderStatus) => void;
}

export function OrderSlideOver({ order, onClose, onStatusChange }: Props) {
  const stableClose = useCallback(() => onClose(), [onClose]);
  useOverlay(true, stableClose);

  const [resiInput, setResiInput] = useState(order.tracking?.resi || "");
  const [courierInput, setCourierInput] = useState(order.tracking?.courier || "JNE REG");
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [paymentActionLoading, setPaymentActionLoading] = useState(false);

  const handleConfirmPayment = async () => {
    setPaymentActionLoading(true);
    const formData = new FormData();
    formData.append('orderId', order.id);
    const result = await adminConfirmPaymentAction({ success: false }, formData);
    setPaymentActionLoading(false);
    if (result.success) {
      toast.success('Pembayaran dikonfirmasi');
      onStatusChange?.(order.id, 'processing');
    } else {
      toast.error(result.error || 'Gagal mengkonfirmasi pembayaran');
    }
  };

  const handleRejectPayment = async () => {
    if (!rejectReason.trim()) { toast.error('Alasan wajib diisi'); return; }
    setPaymentActionLoading(true);
    const formData = new FormData();
    formData.append('orderId', order.id);
    formData.append('reason', rejectReason);
    const result = await adminRejectPaymentAction({ success: false }, formData);
    setPaymentActionLoading(false);
    if (result.success) {
      toast.success('Bukti pembayaran ditolak');
      setShowRejectForm(false);
      setRejectReason('');
    } else {
      toast.error(result.error || 'Gagal menolak pembayaran');
    }
  };

  const handleStatusChange = (val: string) => {
    onStatusChange?.(order.id, val as OrderStatus);
    toast.success(`Status pesanan ${order.id} diubah ke ${STATUS_OPTIONS.find(s => s.value === val)?.label}`);
  };

  const handleSaveResi = () => {
    if (!resiInput.trim()) { toast.error("Masukkan nomor resi"); return; }
    toast.success(`Resi ${resiInput} berhasil disimpan untuk ${order.id}`);
  };

  return (
    <Portal>
    <div className="fixed top-0 left-0 w-screen z-[100] flex justify-end" style={{ height: '100dvh' }}>
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-background shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300" style={{ height: '100%' }}>
        {/* Header */}
        <div className="sticky top-0 bg-background border-b px-5 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="font-bold text-lg">{order.id}</h2>
            <p className="text-xs text-muted-foreground">{new Date(order.date).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}><X className="w-5 h-5" /></Button>
        </div>

        <div className="p-5 space-y-6">
          {/* Status Change */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Update Status</Label>
            <Select value={order.status} onValueChange={handleStatusChange}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map(s => (
                  <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Customer Info */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" /> Pelanggan
            </Label>
            <div className="bg-muted/50 rounded-lg p-3 text-sm space-y-1">
              <p className="font-semibold">{order.customer}</p>
              <p className="text-muted-foreground">{order.email}</p>
              <p className="text-muted-foreground">{order.phone}</p>
            </div>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" /> Alamat Pengiriman
            </Label>
            <div className="bg-muted/50 rounded-lg p-3 text-sm">
              <p className="font-medium">{order.address.recipient}</p>
              <p className="text-muted-foreground">{order.address.address}</p>
              <p className="text-muted-foreground">{order.address.city}, {order.address.province} {order.address.postal}</p>
            </div>
          </div>

          {/* Items */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5" /> Item Pesanan
            </Label>
            <div className="space-y-2">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center gap-3 bg-muted/50 rounded-lg p-3">
                  <div className="w-10 h-10 bg-muted rounded flex items-center justify-center shrink-0">
                    <Package className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.sku} · x{item.qty}</p>
                  </div>
                  <p className="text-sm font-semibold">{formatRupiah(item.price * item.qty)}</p>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="border-t pt-3 space-y-1.5 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span><span>{formatRupiah(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Diskon</span><span>-{formatRupiah(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-muted-foreground">
                <span>Ongkir</span><span>{order.shippingCost === 0 ? "Gratis" : formatRupiah(order.shippingCost)}</span>
              </div>
              <div className="flex justify-between font-bold text-base pt-1 border-t">
                <span>Total</span><span>{formatRupiah(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5" /> Pembayaran
            </Label>
            <div className="bg-muted/50 rounded-lg p-3 text-sm space-y-3">
              <p className="font-medium">{order.paymentMethod}</p>

              {/* Payment proof image */}
              {order.paymentProof && (
                <div className="space-y-2">
                  <p className="text-xs text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Bukti bayar diterima
                  </p>
                  <div className="relative w-full max-w-[200px] aspect-[3/4] rounded-lg overflow-hidden border border-border">
                    <Image
                      src={order.paymentProof}
                      alt="Bukti pembayaran"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                </div>
              )}

              {/* Waiting for proof */}
              {!order.paymentProof && order.status === "pending" && (
                <p className="text-xs text-amber-600 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Menunggu bukti bayar
                </p>
              )}

              {/* Confirm / Reject buttons — only for pending orders WITH proof */}
              {order.paymentProof && order.status === "pending" && (
                <div className="space-y-2 pt-2 border-t border-border">
                  {!showRejectForm ? (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={handleConfirmPayment}
                        disabled={paymentActionLoading}
                      >
                        <CheckCircle2 className="w-4 h-4 mr-1" />
                        Konfirmasi Bayar
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="flex-1"
                        onClick={() => setShowRejectForm(true)}
                        disabled={paymentActionLoading}
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Tolak
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Textarea
                        placeholder="Alasan penolakan (wajib)..."
                        value={rejectReason}
                        onChange={e => setRejectReason(e.target.value)}
                        rows={2}
                        className="text-sm"
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="destructive"
                          className="flex-1"
                          onClick={handleRejectPayment}
                          disabled={paymentActionLoading || !rejectReason.trim()}
                        >
                          Kirim Penolakan
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => { setShowRejectForm(false); setRejectReason(''); }}
                        >
                          Batal
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Tracking / Resi Input */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5" /> Pengiriman
            </Label>
            <div className="space-y-2">
              <Input placeholder="Kurir (JNE REG, SiCepat, dll)" value={courierInput} onChange={e => setCourierInput(e.target.value)} />
              <div className="flex gap-2">
                <Input placeholder="Nomor Resi" value={resiInput} onChange={e => setResiInput(e.target.value)} className="flex-1" />
                {resiInput && (
                  <Button variant="outline" size="icon" onClick={() => { navigator.clipboard.writeText(resiInput); toast.success("Resi disalin!"); }}>
                    <Copy className="w-4 h-4" />
                  </Button>
                )}
              </div>
              <Button size="sm" onClick={handleSaveResi} className="w-full">Simpan Resi & Kirim</Button>
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" /> Catatan Pembeli
              </Label>
              <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 text-sm text-amber-800">
                {order.notes}
              </div>
            </div>
          )}

          {/* Timeline */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Riwayat Status</Label>
            <div className="space-y-0">
              {order.timeline.map((t, i) => (
                <div key={i} className="flex gap-3 pb-4 last:pb-0">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                      {statusIcon(t.status)}
                    </div>
                    {i < order.timeline.length - 1 && <div className="w-px flex-1 bg-border mt-1" />}
                  </div>
                  <div className="pt-1">
                    <p className="text-sm font-medium">{t.note}</p>
                    <p className="text-xs text-muted-foreground">{t.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Print */}
          <Button variant="outline" className="w-full opacity-50 cursor-not-allowed" disabled title="Fitur cetak invoice segera hadir">
            <FileText className="w-4 h-4 mr-2" /> Cetak Invoice
          </Button>
        </div>
      </div>
    </div>
    </Portal>
  );
}
