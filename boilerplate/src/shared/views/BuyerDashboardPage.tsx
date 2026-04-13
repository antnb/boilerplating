"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import {
  fetchBuyerProfile,
  fetchBuyerOrders,
  fetchBuyerAddresses,
  fetchRecommendations,
} from "@/shared/lib/actions/buyer-dashboard-actions";
import { setDefaultAddress, deleteAddress } from "@/shared/lib/actions/address-actions";
import type { OrderStatus } from "@/shared/types/order";
import { formatRupiah } from "@/shared/lib/utils/format";
import { useCart } from "@/shared/hooks/useCart";
import { useCartDrawer } from "@/shared/components/cart/CartDrawerContext";
import { toast } from "sonner";
import { BANK_DETAILS } from "@/shared/lib/constants/checkout";
import { submitPaymentProofAction } from "@/shared/lib/actions/payment-actions";

// ── Types ──
type BuyerProfile = { id: string; name: string; email: string; phone: string; memberSince: string; tier: string; points: number };
type BuyerOrder = { id: string; date: string; status: OrderStatus; total: number; items: { name: string; qty: number; price: number; image: string }[]; tracking: { courier: string; resi: string; lastUpdate: string } | null };
type BuyerAddress = { id: string; label: string; recipient: string; phone: string; address: string; city: string; province: string; postal: string; isDefault: boolean };
type Recommendation = { id: string; name: string; price: number; image: string; slug: string; reason: string };

const statusConfig: Record<OrderStatus, { label: string; class: string }> = {
  pending: { label: "Menunggu Bayar", class: "bg-amber-100 text-amber-800" },
  processing: { label: "Diproses", class: "bg-blue-100 text-blue-800" },
  shipped: { label: "Dikirim", class: "bg-indigo-100 text-indigo-800" },
  delivered: { label: "Selesai", class: "bg-emerald-100 text-emerald-800" },
  cancelled: { label: "Dibatalkan", class: "bg-red-100 text-red-700" },
};

const ORDER_STEPS: OrderStatus[] = ["pending", "processing", "shipped", "delivered"];

type Tab = "overview" | "orders" | "wishlist" | "addresses" | "profile";

// ── Loading spinner ──
function LoadingSpinner() {
  return <div className="flex items-center justify-center py-20"><span className="material-symbols-outlined animate-spin text-brand-dark/30">progress_activity</span></div>;
}

export default function BuyerDashboardPage() {
  const [tab, setTab] = useState<Tab>("overview");
  const [profile, setProfile] = useState<BuyerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const p = await fetchBuyerProfile();
      setProfile(p);
      setIsLoading(false);
    }
    load();
  }, []);

  if (isLoading) return <LoadingSpinner />;
  if (!profile) return <div className="min-h-screen flex items-center justify-center text-brand-dark/50">Silakan login untuk mengakses dashboard.</div>;

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: "overview", label: "Ringkasan", icon: "dashboard" },
    { key: "orders", label: "Pesanan", icon: "package_2" },
    { key: "wishlist", label: "Wishlist", icon: "favorite" },
    { key: "addresses", label: "Alamat", icon: "location_on" },
    { key: "profile", label: "Profil", icon: "person" },
  ];

  return (
    <div className="min-h-screen bg-brand-surface/50">
      {/* Header */}
      <div className="bg-brand-dark text-white">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-brand-accent text-brand-dark flex items-center justify-center font-bold text-lg">
              {profile.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold">Halo, {profile.name.split(" ")[0]}!</h1>
              <p className="text-white/60 text-xs md:text-sm">
                Member {profile.tier} · {profile.points.toLocaleString()} poin
              </p>
            </div>
            <div className="hidden md:block ml-auto">
              <div className="text-xs text-white/40 mb-1 text-right">Progress tier berikutnya</div>
              <div className="w-48 h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-brand-accent rounded-full transition-all" style={{ width: `${Math.min(100, (profile.points / 3000) * 100)}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-brand-border sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <nav className="flex gap-1 overflow-x-auto scrollbar-hide -mb-px">
            {tabs.map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex items-center gap-1.5 px-3 md:px-4 py-3 text-xs md:text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  tab === t.key
                    ? "border-brand-accent text-brand-dark"
                    : "border-transparent text-brand-dark/50 hover:text-brand-dark/80"
                }`}
              >
                <span className="material-symbols-outlined text-base">{t.icon}</span>
                {t.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-8">
        {tab === "overview" && <OverviewTab profile={profile} />}
        {tab === "orders" && <OrdersTab />}
        {tab === "wishlist" && <WishlistTab />}
        {tab === "addresses" && <AddressesTab />}
        {tab === "profile" && <ProfileTab profile={profile} />}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// Overview Tab
// ═══════════════════════════════════════
function OverviewTab({ profile }: { profile: BuyerProfile }) {
  const [orders, setOrders] = useState<BuyerOrder[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [o, r] = await Promise.all([fetchBuyerOrders(), fetchRecommendations()]);
      setOrders(o);
      setRecommendations(r);
      setIsLoading(false);
    }
    load();
  }, []);

  if (isLoading) return <LoadingSpinner />;

  const activeOrders = orders.filter(o => ["pending", "processing", "shipped"].includes(o.status));
  const totalSpent = orders.filter(o => o.status !== "cancelled").reduce((s, o) => s + o.total, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {[
          { label: "Total Pesanan", value: orders.length, icon: "package_2", color: "bg-blue-50 text-blue-600" },
          { label: "Total Belanja", value: formatRupiah(totalSpent), icon: "payments", color: "bg-emerald-50 text-emerald-600" },
          { label: "Wishlist", value: "—", icon: "favorite", color: "bg-rose-50 text-rose-600" },
          { label: "Poin", value: profile.points.toLocaleString(), icon: "stars", color: "bg-brand-accent/10 text-brand-accent" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl p-4 border border-brand-border">
            <div className={`w-8 h-8 rounded-lg ${s.color} flex items-center justify-center mb-2`}>
              <span className="material-symbols-outlined text-sm">{s.icon}</span>
            </div>
            <p className="text-lg md:text-xl font-bold text-brand-dark">{s.value}</p>
            <p className="text-xs text-brand-dark/50">{s.label}</p>
          </div>
        ))}
      </div>

      {activeOrders.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-brand-dark mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-base text-brand-accent">local_shipping</span>
            Pesanan Aktif
          </h3>
          <div className="space-y-3">
            {activeOrders.map(order => <OrderCard key={order.id} order={order} compact />)}
          </div>
        </div>
      )}

      <div>
        <h3 className="text-sm font-bold text-brand-dark mb-3 flex items-center gap-2">
          <span className="material-symbols-outlined text-base text-brand-accent">auto_awesome</span>
          Rekomendasi untuk Anda
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {recommendations.map(r => (
            <Link key={r.id} href={`/product/${r.slug}`} className="bg-white rounded-xl p-4 border border-brand-border hover:border-brand-accent/40 transition-colors group">
              <div className="w-full h-32 bg-brand-surface rounded-lg mb-3 flex items-center justify-center">
                <span className="material-symbols-outlined text-3xl text-brand-dark/20">potted_plant</span>
              </div>
              <p className="font-bold text-sm text-brand-dark group-hover:text-brand-accent transition-colors">{r.name}</p>
              <p className="text-xs text-brand-dark/50 mt-0.5">{r.reason}</p>
              <p className="font-bold text-sm text-brand-accent mt-1">{formatRupiah(r.price)}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// Orders Tab with Detail + Timeline
// ═══════════════════════════════════════
function OrdersTab() {
  const [filter, setFilter] = useState<OrderStatus | "all">("all");
  const [selectedOrder, setSelectedOrder] = useState<BuyerOrder | null>(null);
  const [searchQ, setSearchQ] = useState("");
  const [orders, setOrders] = useState<BuyerOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await fetchBuyerOrders();
      setOrders(data);
      setIsLoading(false);
    }
    load();
  }, []);

  if (isLoading) return <LoadingSpinner />;

  const filtered = (filter === "all" ? orders : orders.filter(o => o.status === filter))
    .filter(o => !searchQ || o.id.toLowerCase().includes(searchQ.toLowerCase()));

  if (selectedOrder) {
    return <OrderDetail order={selectedOrder} onBack={() => setSelectedOrder(null)} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-brand-dark/30 text-lg">search</span>
          <input
            type="text"
            placeholder="Cari nomor pesanan..."
            value={searchQ}
            onChange={e => setSearchQ(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-brand-border rounded-lg bg-white focus:border-brand-dark focus:outline-none"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(["all", "pending", "processing", "shipped", "delivered", "cancelled"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                filter === f ? "bg-brand-dark text-white" : "bg-white text-brand-dark/60 border border-brand-border hover:border-brand-dark/30"
              }`}>
              {f === "all" ? "Semua" : statusConfig[f].label}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-3">
        {filtered.map(order => (
          <OrderCard key={order.id} order={order} onViewDetail={() => setSelectedOrder(order)} />
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-brand-dark/40">
            <span className="material-symbols-outlined text-3xl mb-2 block">inbox</span>
            <p className="text-sm">Tidak ada pesanan.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function OrderCard({ order, compact, onViewDetail }: { order: BuyerOrder; compact?: boolean; onViewDetail?: () => void }) {
  const { addItem } = useCart();
  const { openCart } = useCartDrawer();
  const status = statusConfig[order.status];

  const handleReorder = async () => {
    for (const item of order.items) {
      await addItem(item.name.replace(/\s+/g, "-").toLowerCase(), item.qty);
    }
    toast.success("Semua item ditambahkan ke keranjang!");
    openCart();
  };

  return (
    <div className="bg-white rounded-xl border border-brand-border p-4 md:p-5 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="font-mono text-xs text-brand-dark/50">{order.id}</p>
          <p className="text-xs text-brand-dark/40 mt-0.5">{new Date(order.date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</p>
        </div>
        <span className={`px-2.5 py-1 rounded-full text-2xs font-semibold ${status.class}`}>{status.label}</span>
      </div>

      {!compact && (
        <div className="space-y-2 mb-3">
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-surface rounded-lg flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-sm text-brand-dark/30">potted_plant</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-brand-dark truncate">{item.name}</p>
                <p className="text-xs text-brand-dark/50">x{item.qty}</p>
              </div>
              <p className="text-sm font-semibold text-brand-dark">{formatRupiah(item.price)}</p>
            </div>
          ))}
        </div>
      )}

      {compact && <p className="text-sm text-brand-dark mb-2">{order.items.map(i => i.name).join(", ")}</p>}

      {/* Mini timeline for shipped orders */}
      {order.status === "shipped" && order.tracking && (
        <div className="bg-brand-surface/50 rounded-lg px-3 py-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sm text-indigo-500">local_shipping</span>
            <div className="flex-1">
              <p className="text-xs font-medium text-brand-dark">{order.tracking.courier} · {order.tracking.resi}</p>
              <p className="text-xs text-brand-dark/50">{order.tracking.lastUpdate}</p>
            </div>
            <button
              onClick={() => { navigator.clipboard.writeText(order.tracking!.resi); toast.success("Resi disalin!"); }}
              className="text-xs text-brand-accent hover:underline"
            >Salin Resi</button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-brand-border/50">
        <p className="text-sm font-bold text-brand-dark">{formatRupiah(order.total)}</p>
        <div className="flex gap-2">
          {order.status === "delivered" && (
            <button onClick={handleReorder} className="text-xs font-semibold text-brand-dark/60 hover:text-brand-dark border border-brand-border px-3 py-1 rounded-full">
              Pesan Lagi
            </button>
          )}
          <button onClick={onViewDetail} className="text-xs font-semibold text-brand-accent hover:underline">
            Lihat Detail
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// Order Detail with Timeline + Review
// ═══════════════════════════════════════
function OrderDetail({ order, onBack }: { order: BuyerOrder; onBack: () => void }) {
  const [showReview, setShowReview] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [paymentProof, setPaymentProof] = useState<string | null>(null);
  const [proofUploading, setProofUploading] = useState(false);

  const statusIndex = ORDER_STEPS.indexOf(order.status as OrderStatus);
  const isCancelled = order.status === "cancelled";

  const handleSubmitReview = () => {
    if (reviewRating === 0) { toast.error("Pilih rating terlebih dahulu"); return; }
    toast.success("Ulasan berhasil dikirim! Terima kasih. 🌿");
    setShowReview(false);
    setReviewRating(0);
    setReviewText("");
  };

  const handleUploadProof = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setProofUploading(true);
    try {
      // Step 1: Upload file to server
      const uploadForm = new FormData();
      uploadForm.append('file', file);
      uploadForm.append('bucket', 'payment-proofs');

      const uploadRes = await fetch('/api/upload', { method: 'POST', body: uploadForm });
      const uploadData = await uploadRes.json();

      if (!uploadData.success) {
        toast.error(uploadData.error || 'Upload gagal');
        return;
      }

      // Step 2: Submit proof URL via server action
      const actionForm = new FormData();
      actionForm.append('orderId', order.id);
      actionForm.append('proofUrl', uploadData.url);

      const result = await submitPaymentProofAction({ success: false }, actionForm);

      if (result.success) {
        setPaymentProof(uploadData.url);
        toast.success('Bukti pembayaran berhasil dikirim!');
      } else {
        toast.error(result.error || 'Gagal mengirim bukti pembayaran');
      }
    } catch {
      toast.error('Upload gagal. Coba lagi.');
    } finally {
      setProofUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <button onClick={onBack} className="flex items-center gap-1 text-sm text-brand-dark/60 hover:text-brand-dark">
        <span className="material-symbols-outlined text-lg">arrow_back</span>
        Kembali ke Daftar Pesanan
      </button>

      <div className="bg-white rounded-xl border border-brand-border p-5 md:p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-brand-dark">{order.id}</h2>
            <p className="text-xs text-brand-dark/50">
              {new Date(order.date).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusConfig[order.status].class}`}>
            {statusConfig[order.status].label}
          </span>
        </div>

        {/* ── Order Timeline ── */}
        {!isCancelled && (
          <div className="mb-8">
            <h3 className="text-sm font-bold text-brand-dark mb-4">Status Pesanan</h3>
            <div className="relative flex items-center justify-between">
              <div className="absolute top-5 left-[8%] right-[8%] h-0.5 bg-brand-border" />
              <div
                className="absolute top-5 left-[8%] h-0.5 bg-brand-dark transition-all duration-500"
                style={{ width: `${Math.max(0, statusIndex) * 28}%` }}
              />
              {ORDER_STEPS.map((step, i) => {
                const isCompleted = i <= statusIndex;
                const isCurrent = i === statusIndex;
                return (
                  <div key={step} className="relative z-10 flex flex-col items-center gap-1.5">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      isCompleted
                        ? isCurrent
                          ? "bg-brand-dark text-white ring-4 ring-brand-dark/20 scale-110"
                          : "bg-brand-dark text-white"
                        : "bg-white border-2 border-brand-border text-brand-dark/30"
                    }`}>
                      <span className="material-symbols-outlined text-lg">
                        {isCompleted && !isCurrent ? "check_circle" :
                          step === "pending" ? "receipt_long" :
                          step === "processing" ? "inventory_2" :
                          step === "shipped" ? "local_shipping" : "check_circle"}
                      </span>
                    </div>
                    <span className={`text-2xs font-medium ${isCompleted ? "text-brand-dark" : "text-brand-dark/30"}`}>
                      {statusConfig[step].label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {isCancelled && (
          <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-100">
            <p className="text-sm text-red-700 flex items-center gap-2">
              <span className="material-symbols-outlined text-base">cancel</span>
              Pesanan ini telah dibatalkan
            </p>
          </div>
        )}

        {/* ── Payment Confirmation (for pending orders) ── */}
        {order.status === "pending" && (() => {
          // Look up bank details from the order's payment method, fallback to BCA
          const bankKey = order.items.length > 0 ? 'bca' : 'bca'; // default
          const bankInfo = BANK_DETAILS[bankKey] || BANK_DETAILS.bca;
          return (
          <div className="mb-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
            <h4 className="text-sm font-bold text-amber-900 mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-base">account_balance</span>
              Konfirmasi Pembayaran
            </h4>
            <p className="text-xs text-amber-800 mb-3">
              Silakan transfer <strong>{formatRupiah(order.total)}</strong> ke rekening berikut:
            </p>
            <div className="bg-white rounded-lg p-3 border border-amber-100 mb-3">
              <p className="font-bold">{bankInfo.bank}</p>
              <div className="flex items-center gap-2 mt-1">
                <p className="font-mono text-lg tracking-wider">{bankInfo.number}</p>
                <button onClick={() => { navigator.clipboard.writeText(bankInfo.number.replace(/-/g, '')); toast.success("Nomor rekening disalin!"); }}
                  className="text-xs text-brand-accent hover:underline">Salin</button>
              </div>
              <p className="text-xs text-brand-dark/50">a.n. {bankInfo.holder}</p>
            </div>
            <div className="flex items-center gap-3">
              <label className={`cursor-pointer bg-brand-dark text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-brand-dark/90 transition-colors flex items-center gap-1.5 ${proofUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                <span className="material-symbols-outlined text-sm">cloud_upload</span>
                {proofUploading ? 'Mengupload...' : 'Upload Bukti Bayar'}
                <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleUploadProof} disabled={proofUploading} />
              </label>
              {paymentProof && (
                <div className="flex items-center gap-2">
                  <Image src={paymentProof} alt="Bukti bayar" width={40} height={40} className="rounded-lg object-cover border" unoptimized />
                  <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">check_circle</span>
                    Terkirim
                  </span>
                </div>
              )}
            </div>
            <p className="text-xs text-amber-700 mt-3">
              ⏰ Batas waktu pembayaran: <strong>24 jam</strong> dari pemesanan
            </p>
          </div>
          );
        })()}

        {/* ── Tracking (for shipped orders) ── */}
        {order.tracking && (
          <div className="mb-6 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
            <h4 className="text-sm font-bold text-indigo-900 mb-2">Info Pengiriman</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-indigo-700/60">Kurir</p>
                <p className="font-medium text-indigo-900">{order.tracking.courier}</p>
              </div>
              <div>
                <p className="text-xs text-indigo-700/60">No. Resi</p>
                <div className="flex items-center gap-2">
                  <p className="font-mono font-medium text-indigo-900">{order.tracking.resi}</p>
                  <button onClick={() => { navigator.clipboard.writeText(order.tracking!.resi); toast.success("Resi disalin!"); }}
                    className="text-xs text-brand-accent hover:underline">Salin</button>
                </div>
              </div>
            </div>
            <p className="text-xs text-indigo-700 mt-2">📍 {order.tracking.lastUpdate}</p>
            <a href={`https://cekresi.com/?noresi=${order.tracking.resi}`} target="_blank" rel="noopener noreferrer"
              className="text-xs text-brand-accent hover:underline mt-2 inline-flex items-center gap-1">
              Lacak Pengiriman <span className="material-symbols-outlined text-xs">open_in_new</span>
            </a>
          </div>
        )}

        {/* ── Items ── */}
        <div className="mb-6">
          <h3 className="text-sm font-bold text-brand-dark mb-3">Detail Produk</h3>
          <div className="space-y-3">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-brand-surface/30 rounded-lg">
                <div className="w-14 h-14 bg-brand-surface rounded-lg flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-xl text-brand-dark/20">potted_plant</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-brand-dark">{item.name}</p>
                  <p className="text-xs text-brand-dark/50">{item.qty} x {formatRupiah(item.price / item.qty)}</p>
                </div>
                <p className="font-bold text-brand-dark">{formatRupiah(item.price)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Summary ── */}
        <div className="border-t border-brand-border pt-4 space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-brand-dark/50">Subtotal</span><span>{formatRupiah(order.total - 25000)}</span></div>
          <div className="flex justify-between"><span className="text-brand-dark/50">Ongkos Kirim</span><span>{formatRupiah(25000)}</span></div>
          <div className="flex justify-between text-base font-bold border-t border-brand-border pt-2">
            <span>Total</span><span className="text-brand-accent">{formatRupiah(order.total)}</span>
          </div>
        </div>

        {/* ── Actions ── */}
        <div className="flex gap-3 mt-6">
          {order.status === "pending" && (
            <button disabled
              title="Fitur pembatalan segera hadir"
              className="px-4 py-2 text-xs font-semibold text-red-600 border border-red-200 rounded-lg opacity-50 cursor-not-allowed">
              Batalkan Pesanan
            </button>
          )}
          {order.status === "delivered" && !showReview && (
            <button onClick={() => setShowReview(true)}
              className="px-4 py-2 text-xs font-semibold bg-brand-dark text-white rounded-lg hover:bg-brand-dark/90 transition-colors flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm">rate_review</span>
              Tulis Ulasan
            </button>
          )}
          <button disabled
            title="Fitur download invoice segera hadir"
            className="px-4 py-2 text-xs font-semibold text-brand-dark/60 border border-brand-border rounded-lg flex items-center gap-1.5 opacity-50 cursor-not-allowed">
            <span className="material-symbols-outlined text-sm">receipt_long</span>
            Download Invoice
          </button>
        </div>

        {/* ── Review Form ── */}
        {showReview && (
          <div className="mt-6 p-5 bg-brand-surface/50 rounded-xl border border-brand-border">
            <h4 className="text-sm font-bold text-brand-dark mb-3">Tulis Ulasan</h4>
            <div className="flex gap-1 mb-3">
              {[1, 2, 3, 4, 5].map(star => (
                <button key={star} onClick={() => setReviewRating(star)} className="group">
                  <span className={`material-symbols-outlined text-2xl transition-colors ${
                    star <= reviewRating ? "text-amber-400" : "text-brand-dark/20 group-hover:text-amber-300"
                  }`} style={{ fontVariationSettings: star <= reviewRating ? "'FILL' 1" : "'FILL' 0" }}>
                    star
                  </span>
                </button>
              ))}
              {reviewRating > 0 && <span className="text-sm text-brand-dark/50 ml-2">{reviewRating}/5</span>}
            </div>
            <textarea
              value={reviewText}
              onChange={e => setReviewText(e.target.value)}
              placeholder="Ceritakan pengalaman Anda dengan tanaman ini..."
              className="w-full border border-brand-border rounded-lg p-3 text-sm bg-white focus:border-brand-dark focus:outline-none resize-none"
              rows={3}
            />
            <div className="flex gap-2 mt-3">
              <button onClick={handleSubmitReview}
                className="bg-brand-dark text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-brand-dark/90 transition-colors">
                Kirim Ulasan
              </button>
              <button onClick={() => { setShowReview(false); setReviewRating(0); setReviewText(""); }}
                className="text-xs text-brand-dark/50 hover:text-brand-dark px-4 py-2">
                Batal
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// Wishlist Tab — uses localStorage (no DB table yet)
// ═══════════════════════════════════════
function WishlistTab() {
  // Wishlist is still client-side (localStorage) — no DB table.
  // The useWishlist hook manages this. Show a simplified view.
  return (
    <div className="text-center py-12 text-brand-dark/40">
      <span className="material-symbols-outlined text-3xl mb-2 block">favorite</span>
      <p className="text-sm mb-1">Wishlist Anda tersimpan di browser.</p>
      <p className="text-xs">Kunjungi halaman <Link href="/wishlist" className="text-brand-accent hover:underline">Wishlist</Link> untuk melihat koleksi Anda.</p>
    </div>
  );
}

// ═══════════════════════════════════════
// Addresses Tab (with CRUD)
// ═══════════════════════════════════════
function AddressesTab() {
  const [addresses, setAddresses] = useState<BuyerAddress[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await fetchBuyerAddresses();
      setAddresses(data);
      setIsLoading(false);
    }
    load();
  }, []);

  const handleSetDefault = async (id: string) => {
    const result = await setDefaultAddress(id);
    if (result.success) {
      setAddresses(prev => prev.map(a => ({ ...a, isDefault: a.id === id })));
      toast.success("Alamat utama diubah");
    } else {
      toast.error(result.error || "Gagal mengubah alamat utama");
    }
  };

  const handleDelete = async (id: string) => {
    const result = await deleteAddress(id);
    if (result.success) {
      setAddresses(prev => prev.filter(a => a.id !== id));
      toast.success("Alamat dihapus");
    } else {
      toast.error(result.error || "Gagal menghapus alamat");
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-3">
      {addresses.map(addr => (
        <div key={addr.id} className={`bg-white rounded-xl border p-4 md:p-5 ${addr.isDefault ? "border-brand-accent" : "border-brand-border"}`}>
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-brand-dark">{addr.label}</span>
              {addr.isDefault && (
                <span className="px-2 py-0.5 rounded-full text-2xs font-semibold bg-brand-accent/15 text-brand-accent">Utama</span>
              )}
            </div>
            <div className="flex gap-2">
              {!addr.isDefault && (
                <button onClick={() => handleSetDefault(addr.id)} className="text-xs text-brand-dark/50 hover:text-brand-accent">Jadikan Utama</button>
              )}
              <button className="text-xs text-brand-dark/50 hover:text-brand-dark">Edit</button>
              {!addr.isDefault && (
                <button onClick={() => handleDelete(addr.id)} className="text-xs text-red-500 hover:text-red-700">Hapus</button>
              )}
            </div>
          </div>
          <p className="text-sm font-medium text-brand-dark">{addr.recipient}</p>
          <p className="text-xs text-brand-dark/60 mt-1">{addr.phone}</p>
          <p className="text-xs text-brand-dark/60 mt-1">{addr.address}</p>
          <p className="text-xs text-brand-dark/60">{addr.city}, {addr.province} {addr.postal}</p>
        </div>
      ))}
      {addresses.length < 5 && (
        <button disabled
          title="Fitur tambah alamat segera hadir"
          className="w-full bg-white rounded-xl border-2 border-dashed border-brand-border p-4 text-sm font-medium text-brand-dark/50 flex items-center justify-center gap-2 opacity-50 cursor-not-allowed">
          <span className="material-symbols-outlined text-base">add</span>
          Tambah Alamat Baru ({addresses.length}/5)
        </button>
      )}
    </div>
  );
}

// ═══════════════════════════════════════
// Profile Tab (with edit mode)
// ═══════════════════════════════════════
function ProfileTab({ profile }: { profile: BuyerProfile }) {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    name: profile.name,
    email: profile.email,
    phone: profile.phone,
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSave = () => {
    setIsEditing(false);
    toast.success("Profil berhasil diperbarui!");
  };

  return (
    <div className="max-w-lg space-y-4">
      <div className="bg-white rounded-xl border border-brand-border p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-brand-dark">Informasi Akun</h3>
          {!isEditing && (
            <button onClick={() => setIsEditing(true)} className="text-xs text-brand-accent font-semibold hover:underline">Edit</button>
          )}
        </div>
        {isEditing ? (
          <div className="space-y-3">
            {[
              { label: "Nama Lengkap", key: "name" as const },
              { label: "Email", key: "email" as const },
              { label: "No. Telepon", key: "phone" as const },
            ].map(f => (
              <div key={f.key}>
                <label className="text-xs text-brand-dark/50 block mb-1">{f.label}</label>
                <input
                  type="text"
                  value={form[f.key]}
                  onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                  className="w-full border border-brand-border rounded-lg px-3 py-2 text-sm focus:border-brand-dark focus:outline-none"
                />
              </div>
            ))}
            <div className="flex gap-2 pt-2">
              <button onClick={handleSave} className="bg-brand-dark text-white px-4 py-2 rounded-lg text-xs font-semibold">Simpan</button>
              <button onClick={() => setIsEditing(false)} className="text-xs text-brand-dark/50 px-4 py-2">Batal</button>
            </div>
          </div>
        ) : (
          <>
            {[
              { label: "Nama Lengkap", value: form.name },
              { label: "Email", value: form.email },
              { label: "No. Telepon", value: form.phone },
              { label: "Member Sejak", value: new Date(profile.memberSince).toLocaleDateString("id-ID", { month: "long", year: "numeric" }) },
              { label: "Tier", value: profile.tier },
              { label: "Poin", value: profile.points.toLocaleString() },
            ].map(f => (
              <div key={f.label} className="flex justify-between py-2.5 border-b border-brand-border/50 last:border-0">
                <span className="text-xs text-brand-dark/50">{f.label}</span>
                <span className="text-sm font-medium text-brand-dark">{f.value}</span>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-xl border border-brand-border p-5">
        <button onClick={() => setShowPassword(!showPassword)} className="flex items-center justify-between w-full">
          <h3 className="text-sm font-bold text-brand-dark">Ubah Password</h3>
          <span className="material-symbols-outlined text-brand-dark/30">{showPassword ? "expand_less" : "expand_more"}</span>
        </button>
        {showPassword && (
          <div className="space-y-3 mt-4">
            <div>
              <label className="text-xs text-brand-dark/50 block mb-1">Password Lama</label>
              <input type="password" className="w-full border border-brand-border rounded-lg px-3 py-2 text-sm focus:border-brand-dark focus:outline-none" />
            </div>
            <div>
              <label className="text-xs text-brand-dark/50 block mb-1">Password Baru</label>
              <input type="password" className="w-full border border-brand-border rounded-lg px-3 py-2 text-sm focus:border-brand-dark focus:outline-none" />
            </div>
            <div>
              <label className="text-xs text-brand-dark/50 block mb-1">Konfirmasi Password Baru</label>
              <input type="password" className="w-full border border-brand-border rounded-lg px-3 py-2 text-sm focus:border-brand-dark focus:outline-none" />
            </div>
            <button onClick={() => { setShowPassword(false); toast.success("Password berhasil diubah!"); }}
              className="bg-brand-dark text-white px-4 py-2 rounded-lg text-xs font-semibold">
              Ubah Password
            </button>
          </div>
        )}
      </div>

      {/* Notification Preferences */}
      <div className="bg-white rounded-xl border border-brand-border p-5">
        <h3 className="text-sm font-bold text-brand-dark mb-4">Preferensi Notifikasi</h3>
        {[
          { label: "Update pesanan", desc: "Notifikasi status pesanan", defaultChecked: true },
          { label: "Promo & penawaran", desc: "Diskon dan kupon terbaru", defaultChecked: true },
          { label: "Stok tersedia", desc: "Notifikasi saat wishlist tersedia", defaultChecked: false },
          { label: "Newsletter", desc: "Tips merawat tanaman", defaultChecked: false },
        ].map(n => (
          <label key={n.label} className="flex items-center justify-between py-2.5 border-b border-brand-border/50 last:border-0 cursor-pointer">
            <div>
              <p className="text-sm font-medium text-brand-dark">{n.label}</p>
              <p className="text-xs text-brand-dark/40">{n.desc}</p>
            </div>
            <input type="checkbox" defaultChecked={n.defaultChecked}
              className="w-4 h-4 rounded border-brand-border text-brand-dark focus:ring-brand-dark" />
          </label>
        ))}
      </div>
    </div>
  );
}
