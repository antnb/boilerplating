"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { OrderStatus, AdminOrderDetail } from "@/shared/types/order";
import {
  fetchDashboardStats,
  fetchTopProducts,
  fetchAdminOrders,
  fetchInventory,
  fetchCustomers,
  fetchArticles,
  fetchOrderDetail,
  updateAdminOrderStatus,
} from "@/shared/lib/actions/admin-actions";
import { formatRupiah } from "@/shared/lib/utils/format";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { OrderSlideOver } from "@/shared/components/staff/OrderSlideOver";
import { ProductFormTabs } from "@/shared/components/staff/ProductFormTabs";
import { fetchProductForEdit } from "@/shared/lib/actions/admin-actions";
import { updateStockAction, deleteProductAction } from "@/shared/lib/actions/product-admin-actions";
import {
  fetchAdminReviews,
  deleteReviewAction,
  toggleReviewVerifiedAction,
} from "@/shared/lib/actions/review-admin-actions";
import {
  fetchStaffProfiles,
  fetchEligibleStaffUsers,
  createStaffProfileAction,
  updateStaffProfileAction,
} from "@/shared/lib/actions/staff-actions";
import { Portal } from "@/shared/components/ui/portal";
import { Button } from "@/shared/components/ui/button";
import { CouponManager } from "@/shared/components/staff/CouponManager";
import { ArticleEditor } from "@/shared/components/staff/ArticleEditor";
import { CustomerDetail } from "@/shared/components/staff/CustomerDetail";
import { toast } from "sonner";

// ── Types for admin dashboard data ──
type AdminOrder = { id: string; customer: string; date: string; status: OrderStatus; total: number; items: number };
type InventoryItem = { id: string; name: string; sku: string; stock: number; price: number; category: string; status: "active" | "low_stock" | "out_of_stock" };
type CustomerItem = { id: string; name: string; email: string; orders: number; totalSpent: number; lastOrder: string; tier: string };
type ArticleItem = { id: string; title: string; author: string; status: "published" | "draft"; date: string; views: number };

// ── Status badge ──
const statusConfig: Record<OrderStatus, { label: string; class: string }> = {
  pending: { label: "Menunggu", class: "bg-amber-100 text-amber-800" },
  processing: { label: "Diproses", class: "bg-blue-100 text-blue-800" },
  shipped: { label: "Dikirim", class: "bg-indigo-100 text-indigo-800" },
  delivered: { label: "Selesai", class: "bg-emerald-100 text-emerald-800" },
  cancelled: { label: "Dibatalkan", class: "bg-red-100 text-red-700" },
};

const inventoryStatusConfig = {
  active: { label: "Aktif", class: "bg-emerald-100 text-emerald-800" },
  low_stock: { label: "Stok Rendah", class: "bg-amber-100 text-amber-800" },
  out_of_stock: { label: "Habis", class: "bg-red-100 text-red-700" },
};

type Section = "overview" | "orders" | "inventory" | "customers" | "articles" | "reviews" | "team" | "coupons" | "settings";

const navItems: { key: Section; label: string; icon: string }[] = [
  { key: "overview", label: "Dashboard", icon: "space_dashboard" },
  { key: "orders", label: "Pesanan", icon: "package_2" },
  { key: "inventory", label: "Inventaris", icon: "inventory_2" },
  { key: "customers", label: "Pelanggan", icon: "group" },
  { key: "articles", label: "Artikel", icon: "article" },
  { key: "reviews", label: "Ulasan", icon: "rate_review" },
  { key: "team", label: "Tim & Expert", icon: "group_work" },
  { key: "coupons", label: "Kupon", icon: "confirmation_number" },
  { key: "settings", label: "Pengaturan", icon: "settings" },
];

export default function StaffDashboardPage() {
  const [section, setSection] = useState<Section>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-[hsl(var(--brand-surface))] flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "w-56" : "w-14"} hidden md:flex flex-col bg-brand-dark text-white shrink-0 transition-all duration-300 sticky top-0 h-screen`}>
        <div className="p-4 flex items-center gap-2 border-b border-white/10">
          <span className="material-symbols-outlined text-brand-accent">eco</span>
          {sidebarOpen && <span className="font-bold text-sm tracking-wide">BMJ Admin</span>}
        </div>
        <nav className="flex-1 py-3 overflow-y-auto">
          {navItems.map(item => (
            <button
              key={item.key}
              onClick={() => setSection(item.key)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                section === item.key
                  ? "bg-white/10 text-brand-accent font-semibold"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <span className="material-symbols-outlined text-lg">{item.icon}</span>
              {sidebarOpen && item.label}
            </button>
          ))}

          {/* Pages Settings — navigates to file-system route */}
          {sidebarOpen && (
            <Link
              href="/manage/pages"
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors mt-2 border-t border-white/10 pt-3"
            >
              <span className="material-symbols-outlined text-lg">web</span>
              Pages Settings
            </Link>
          )}
        </nav>
        <div className="p-3 border-t border-white/10">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center justify-center gap-2 text-white/40 hover:text-white/70 text-xs py-2"
          >
            <span className="material-symbols-outlined text-sm">
              {sidebarOpen ? "chevron_left" : "chevron_right"}
            </span>
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-brand-border z-30 flex">
        {navItems.slice(0, 5).map(item => (
          <button
            key={item.key}
            onClick={() => setSection(item.key)}
            className={`flex-1 flex flex-col items-center gap-0.5 py-2 text-2xs ${
              section === item.key ? "text-brand-accent font-semibold" : "text-brand-dark/40"
            }`}
          >
            <span className="material-symbols-outlined text-lg">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        <header className="bg-white border-b border-brand-border sticky top-0 z-20 px-4 md:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="md:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <span className="material-symbols-outlined">menu</span>
            </button>
            <h1 className="text-base md:text-lg font-bold text-brand-dark">
              {navItems.find(n => n.key === section)?.label}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative">
              <span className="material-symbols-outlined text-brand-dark/50">notifications</span>
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-2xs flex items-center justify-center">3</span>
            </button>
            <div className="w-8 h-8 rounded-full bg-brand-dark text-white flex items-center justify-center text-xs font-bold">PA</div>
          </div>
        </header>

        <div className="p-4 md:p-6 pb-20 md:pb-6">
          {section === "overview" && <OverviewSection />}
          {section === "orders" && <OrdersSection />}
          {section === "inventory" && <InventorySection />}
          {section === "customers" && <CustomersSection />}
          {section === "articles" && <ArticlesSection />}
          {section === "reviews" && <ReviewsSection />}
          {section === "team" && <TeamManagementSection />}
          {section === "coupons" && <CouponManager />}
          {section === "settings" && <SettingsSection />}
        </div>
      </div>
    </div>
  );
}

// ── Loading spinner helper ──
function LoadingSpinner() {
  return <div className="flex items-center justify-center py-20"><span className="material-symbols-outlined animate-spin text-brand-dark/30">progress_activity</span></div>;
}

// ═══════════════════════════════════════
// Overview / Analytics
// ═══════════════════════════════════════
function OverviewSection() {
  const [stats, setStats] = useState<{ label: string; icon: string; value: number; change: number; period: string; format: (v: number) => string }[]>([]);
  const [topProducts, setTopProducts] = useState<{ name: string; sold: number; revenue: number }[]>([]);
  const [recentOrders, setRecentOrders] = useState<AdminOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [dashStats, top, orders] = await Promise.all([
        fetchDashboardStats(),
        fetchTopProducts(),
        fetchAdminOrders(),
      ]);
      setStats([
        { ...dashStats.revenue, label: "Revenue", icon: "payments", format: (v: number) => formatRupiah(v) },
        { ...dashStats.orders, label: "Pesanan", icon: "package_2", format: (v: number) => v.toString() },
        { ...dashStats.customers, label: "Pelanggan", icon: "group", format: (v: number) => v.toString() },
        { ...dashStats.avgOrderValue, label: "Rata-rata Order", icon: "analytics", format: (v: number) => formatRupiah(v) },
      ]);
      setTopProducts(top);
      setRecentOrders(orders.slice(0, 5));
      setIsLoading(false);
    }
    load();
  }, []);

  if (isLoading) return <LoadingSpinner />;

  // Revenue chart: no monthly breakdown table in DB yet — placeholder
  const revenueChart: { month: string; revenue: number }[] = [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-xl p-4 md:p-5 border border-brand-border">
            <div className="flex items-center justify-between mb-3">
              <span className="material-symbols-outlined text-brand-dark/30 text-xl">{s.icon}</span>
              <span className={`text-2xs font-semibold px-2 py-0.5 rounded-full ${
                s.change >= 0 ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
              }`}>
                {s.change >= 0 ? "+" : ""}{s.change}%
              </span>
            </div>
            <p className="text-lg md:text-xl font-bold text-brand-dark">{s.format(s.value)}</p>
            <p className="text-xs text-brand-dark/40 mt-0.5">{s.period}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-xl p-5 border border-brand-border">
          <h3 className="text-sm font-bold text-brand-dark mb-4">Revenue Bulanan</h3>
          {revenueChart.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={revenueChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--brand-border))" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--brand-dark) / 0.4)" }} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(var(--brand-dark) / 0.4)" }} tickFormatter={v => `${(v / 1000000).toFixed(0)}jt`} />
                <Tooltip formatter={(value: number) => [formatRupiah(value), "Revenue"]} contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--brand-border))", fontSize: 12 }} />
                <Bar dataKey="revenue" fill="hsl(var(--brand-dark))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[240px] text-sm text-brand-dark/30">Belum ada data revenue bulanan</div>
          )}
        </div>
        <div className="bg-white rounded-xl p-5 border border-brand-border">
          <h3 className="text-sm font-bold text-brand-dark mb-4">Produk Terlaris</h3>
          <div className="space-y-3">
            {topProducts.map((p, i) => (
              <div key={p.name} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-brand-surface text-brand-dark/40 flex items-center justify-center text-2xs font-bold">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-brand-dark truncate">{p.name}</p>
                  <p className="text-2xs text-brand-dark/40">{p.sold} terjual</p>
                </div>
                <p className="text-xs font-bold text-brand-dark">{formatRupiah(p.revenue)}</p>
              </div>
            ))}
            {topProducts.length === 0 && <p className="text-xs text-brand-dark/30 text-center py-4">Belum ada data penjualan</p>}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl border border-brand-border">
        <div className="p-5 pb-3 flex items-center justify-between">
          <h3 className="text-sm font-bold text-brand-dark">Pesanan Terbaru</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-t border-brand-border/50">
                <th className="text-left px-5 py-2.5 text-xs font-semibold text-brand-dark/40">ID</th>
                <th className="text-left px-5 py-2.5 text-xs font-semibold text-brand-dark/40">Pelanggan</th>
                <th className="text-left px-5 py-2.5 text-xs font-semibold text-brand-dark/40">Tanggal</th>
                <th className="text-left px-5 py-2.5 text-xs font-semibold text-brand-dark/40">Status</th>
                <th className="text-right px-5 py-2.5 text-xs font-semibold text-brand-dark/40">Total</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(o => (
                <tr key={o.id} className="border-t border-brand-border/30 hover:bg-brand-surface/30">
                  <td className="px-5 py-3 font-mono text-xs text-brand-dark/60">{o.id}</td>
                  <td className="px-5 py-3 font-medium text-brand-dark">{o.customer}</td>
                  <td className="px-5 py-3 text-xs text-brand-dark/50">{new Date(o.date).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-2xs font-semibold ${statusConfig[o.status].class}`}>{statusConfig[o.status].label}</span>
                  </td>
                  <td className="px-5 py-3 text-right font-semibold">{formatRupiah(o.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// Orders Management with Slide-Over
// ═══════════════════════════════════════
function OrdersSection() {
  const [filter, setFilter] = useState<OrderStatus | "all">("all");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [selectedDetail, setSelectedDetail] = useState<AdminOrderDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await fetchAdminOrders();
      setOrders(data);
      setIsLoading(false);
    }
    load();
  }, []);

  const filtered = filter === "all" ? orders : orders.filter(o => o.status === filter);

  const handleSelectOrder = async (orderId: string) => {
    setSelectedOrderId(orderId);
    const detail = await fetchOrderDetail(orderId);
    setSelectedDetail(detail);
  };

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    await updateAdminOrderStatus(orderId, newStatus);
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          {(["all", "pending", "processing", "shipped", "delivered", "cancelled"] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                filter === f ? "bg-brand-dark text-white" : "bg-white text-brand-dark/60 border border-brand-border"
              }`}
            >
              {f === "all" ? `Semua (${orders.length})` : `${statusConfig[f].label} (${orders.filter(o => o.status === f).length})`}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-brand-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-brand-surface/50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-brand-dark/50">Order ID</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-brand-dark/50">Pelanggan</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-brand-dark/50">Tanggal</th>
                <th className="text-center px-5 py-3 text-xs font-semibold text-brand-dark/50">Item</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-brand-dark/50">Status</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-brand-dark/50">Total</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-brand-dark/50">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(o => (
                <tr key={o.id} className="border-t border-brand-border/30 hover:bg-brand-surface/20">
                  <td className="px-5 py-3 font-mono text-xs">{o.id}</td>
                  <td className="px-5 py-3 font-medium">{o.customer}</td>
                  <td className="px-5 py-3 text-xs text-brand-dark/50">{new Date(o.date).toLocaleDateString("id-ID")}</td>
                  <td className="px-5 py-3 text-center text-xs">{o.items}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-2xs font-semibold ${statusConfig[o.status].class}`}>{statusConfig[o.status].label}</span>
                  </td>
                  <td className="px-5 py-3 text-right font-semibold">{formatRupiah(o.total)}</td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => handleSelectOrder(o.id)}
                      className="text-xs text-brand-accent font-semibold hover:underline"
                    >Detail</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedDetail && (
        <OrderSlideOver
          order={selectedDetail}
          onClose={() => { setSelectedOrderId(null); setSelectedDetail(null); }}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
}

// ═══════════════════════════════════════
// Inventory with Product Form
// ═══════════════════════════════════════
function InventorySection() {
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [editingStock, setEditingStock] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const loadInventory = async () => {
    const data = await fetchInventory();
    setInventory(data);
    setIsLoading(false);
  };

  useEffect(() => { loadInventory(); }, []);

  const handleInlineStockEdit = async (id: string, newStock: number) => {
    // Optimistic update
    setInventory(prev => prev.map(item =>
      item.id === id ? {
        ...item,
        stock: newStock,
        status: newStock === 0 ? "out_of_stock" as const : newStock <= 3 ? "low_stock" as const : "active" as const,
      } : item
    ));
    setEditingStock(null);

    // Persist via Server Action
    const result = await updateStockAction(id, newStock);
    if (result.success) {
      toast.success("Stok berhasil diupdate");
    } else {
      toast.error(result.error);
      loadInventory(); // Revert on failure
    }
  };

  const handleEditProduct = async (id: string) => {
    const product = await fetchProductForEdit(id);
    if (product) {
      setEditData(product);
      setShowForm(true);
    } else {
      toast.error("Produk tidak ditemukan");
    }
  };

  const handleDelete = async (id: string) => {
    const result = await deleteProductAction(id);
    if (result.success) {
      toast.success("Produk berhasil dihapus");
      setDeleteConfirm(null);
      loadInventory();
    } else {
      toast.error(result.error);
    }
  };

  const handleFormSaved = () => {
    loadInventory(); // Refresh table after save
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-brand-dark/50">{inventory.length} produk</p>
        <button
          onClick={() => { setEditData(undefined); setShowForm(true); }}
          className="bg-brand-dark text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 hover:bg-brand-dark/90 transition-colors"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          Tambah Produk
        </button>
      </div>

      <div className="bg-white rounded-xl border border-brand-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-brand-surface/50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-brand-dark/50">Produk</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-brand-dark/50">SKU</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-brand-dark/50">Kategori</th>
                <th className="text-center px-5 py-3 text-xs font-semibold text-brand-dark/50">Stok</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-brand-dark/50">Status</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-brand-dark/50">Harga</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-brand-dark/50">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map(item => {
                const st = inventoryStatusConfig[item.status];
                return (
                  <tr key={item.id} className={`border-t border-brand-border/30 hover:bg-brand-surface/20 ${item.status === "low_stock" ? "bg-amber-50/30" : item.status === "out_of_stock" ? "bg-red-50/30" : ""}`}>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-brand-surface rounded-lg flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-sm text-brand-dark/30">potted_plant</span>
                        </div>
                        <span className="font-medium text-brand-dark">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 font-mono text-xs text-brand-dark/50">{item.sku}</td>
                    <td className="px-5 py-3 text-xs">{item.category}</td>
                    <td className="px-5 py-3 text-center">
                      {editingStock === item.id ? (
                        <input
                          type="number"
                          defaultValue={item.stock}
                          className="w-16 text-center text-sm border rounded px-1 py-0.5"
                          autoFocus
                          onBlur={e => handleInlineStockEdit(item.id, Number(e.target.value))}
                          onKeyDown={e => { if (e.key === "Enter") handleInlineStockEdit(item.id, Number((e.target as HTMLInputElement).value)); }}
                        />
                      ) : (
                        <button
                          onClick={() => setEditingStock(item.id)}
                          className="font-semibold hover:text-brand-accent cursor-pointer"
                          title="Klik untuk edit stok"
                        >
                          {item.stock}
                        </button>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-2xs font-semibold ${st.class}`}>{st.label}</span>
                    </td>
                    <td className="px-5 py-3 text-right font-semibold">{formatRupiah(item.price)}</td>
                    <td className="px-5 py-3 text-right">
                      <button
                        onClick={() => handleEditProduct(item.id)}
                        className="text-xs text-brand-accent font-semibold hover:underline"
                      >Edit</button>
                      <button
                        onClick={() => setDeleteConfirm(item.id)}
                        className="text-xs text-red-500 font-semibold hover:underline ml-2"
                      >Hapus</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {deleteConfirm && (
        <Portal>
          <div className="fixed inset-0 z-[100] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={() => setDeleteConfirm(null)} />
            <div className="relative bg-white rounded-xl p-6 max-w-sm shadow-2xl space-y-4">
              <h3 className="font-bold text-brand-dark">Hapus Produk?</h3>
              <p className="text-sm text-brand-dark/70">Produk akan dihapus permanen dan tidak bisa dikembalikan.</p>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setDeleteConfirm(null)}>Batal</Button>
                <Button variant="destructive" className="flex-1" onClick={() => handleDelete(deleteConfirm)}>Hapus</Button>
              </div>
            </div>
          </div>
        </Portal>
      )}

      {showForm && (
        <ProductFormTabs
          editData={editData}
          onClose={() => setShowForm(false)}
          onSaved={handleFormSaved}
        />
      )}
    </div>
  );
}

// ═══════════════════════════════════════
// Customers with Detail Slide-Over
// ═══════════════════════════════════════
function CustomersSection() {
  const [customers, setCustomers] = useState<CustomerItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await fetchCustomers();
      setCustomers(data);
      setIsLoading(false);
    }
    load();
  }, []);

  const tierColors: Record<string, string> = {
    Platinum: "bg-violet-100 text-violet-700",
    Gold: "bg-amber-100 text-amber-700",
    Silver: "bg-gray-100 text-gray-600",
    Bronze: "bg-orange-100 text-orange-700",
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <>
      <div className="bg-white rounded-xl border border-brand-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-brand-surface/50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-brand-dark/50">Pelanggan</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-brand-dark/50">Tier</th>
                <th className="text-center px-5 py-3 text-xs font-semibold text-brand-dark/50">Pesanan</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-brand-dark/50">Total Belanja</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-brand-dark/50">Order Terakhir</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-brand-dark/50">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {customers.map(c => (
                <tr key={c.id} className="border-t border-brand-border/30 hover:bg-brand-surface/20">
                  <td className="px-5 py-3">
                    <div>
                      <p className="font-medium text-brand-dark">{c.name}</p>
                      <p className="text-2xs text-brand-dark/40">{c.email}</p>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-2xs font-semibold ${tierColors[c.tier] || "bg-gray-100"}`}>{c.tier}</span>
                  </td>
                  <td className="px-5 py-3 text-center">{c.orders}</td>
                  <td className="px-5 py-3 text-right font-semibold">{formatRupiah(c.totalSpent)}</td>
                  <td className="px-5 py-3 text-xs text-brand-dark/50">{new Date(c.lastOrder).toLocaleDateString("id-ID")}</td>
                  <td className="px-5 py-3 text-right">
                    <button onClick={() => setSelectedCustomer(c)} className="text-xs text-brand-accent font-semibold hover:underline">Detail</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {selectedCustomer && <CustomerDetail customer={selectedCustomer} onClose={() => setSelectedCustomer(null)} />}
    </>
  );
}

// ═══════════════════════════════════════
// Articles with Editor
// ═══════════════════════════════════════
function ArticlesSection() {
  const [showEditor, setShowEditor] = useState(false);
  const [editArticle, setEditArticle] = useState<ArticleItem | null>(null);
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await fetchArticles();
      setArticles(data);
      setIsLoading(false);
    }
    load();
  }, []);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-brand-dark/50">{articles.length} artikel</p>
        <button
          onClick={() => { setEditArticle(null); setShowEditor(true); }}
          className="bg-brand-dark text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 hover:bg-brand-dark/90 transition-colors"
        >
          <span className="material-symbols-outlined text-sm">edit_note</span>
          Tulis Artikel
        </button>
      </div>

      <div className="space-y-3">
        {articles.map(a => (
          <div key={a.id} className="bg-white rounded-xl border border-brand-border p-4 md:p-5 flex items-start gap-4">
            <div className="w-16 h-16 bg-brand-surface rounded-lg flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-xl text-brand-dark/20">article</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="font-semibold text-sm text-brand-dark">{a.title}</h4>
                  <p className="text-xs text-brand-dark/40 mt-0.5">
                    {a.author} · {new Date(a.date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-2xs font-semibold shrink-0 ${
                  a.status === "published" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-600"
                }`}>
                  {a.status === "published" ? "Published" : "Draft"}
                </span>
              </div>
              {a.status === "published" && (
                <p className="text-xs text-brand-dark/40 mt-1">
                  <span className="material-symbols-outlined text-xs align-text-bottom">visibility</span> {a.views.toLocaleString()} views
                </p>
              )}
            </div>
            <button
              onClick={() => { setEditArticle(a); setShowEditor(true); }}
              className="text-xs text-brand-accent font-semibold hover:underline shrink-0"
            >Edit</button>
          </div>
        ))}
      </div>

      {showEditor && (
        <ArticleEditor
          article={editArticle ? { id: editArticle.id, title: editArticle.title, author: editArticle.author, status: editArticle.status } : undefined}
          onClose={() => setShowEditor(false)}
        />
      )}
    </div>
  );
}

// ═══════════════════════════════════════
// Reviews Moderation
// ═══════════════════════════════════════
type AdminReview = {
  id: string;
  rating: number;
  title: string | null;
  comment: string;
  photos: string[];
  isVerified: boolean;
  customerName: string;
  customerEmail: string;
  productName: string;
  productSlug: string;
  date: string;
};

function ReviewsSection() {
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "verified" | "unverified">("all");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const loadReviews = async () => {
    const data = await fetchAdminReviews();
    setReviews(data);
    setIsLoading(false);
  };

  useEffect(() => { loadReviews(); }, []);

  const handleToggleVerified = async (id: string) => {
    const result = await toggleReviewVerifiedAction(id);
    if (result.success) {
      setReviews(prev => prev.map(r => r.id === id ? { ...r, isVerified: result.isVerified! } : r));
      toast.success(result.isVerified ? "Ulasan diverifikasi" : "Verifikasi dibatalkan");
    } else {
      toast.error(result.error);
    }
  };

  const handleDelete = async (id: string) => {
    const result = await deleteReviewAction(id);
    if (result.success) {
      setReviews(prev => prev.filter(r => r.id !== id));
      setDeleteConfirmId(null);
      toast.success("Ulasan dihapus");
    } else {
      toast.error(result.error);
    }
  };

  const filtered = filter === "all"
    ? reviews
    : filter === "verified"
      ? reviews.filter(r => r.isVerified)
      : reviews.filter(r => !r.isVerified);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex gap-2">
          {(["all", "unverified", "verified"] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                filter === f ? "bg-brand-dark text-white" : "bg-white text-brand-dark/60 border border-brand-border"
              }`}
            >
              {f === "all" ? `Semua (${reviews.length})`
                : f === "unverified" ? `Belum Verifikasi (${reviews.filter(r => !r.isVerified).length})`
                : `Terverifikasi (${reviews.filter(r => r.isVerified).length})`}
            </button>
          ))}
        </div>
        <p className="text-xs text-brand-dark/50">{filtered.length} ulasan</p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-brand-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-brand-surface/50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-brand-dark/50">Produk</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-brand-dark/50">Pelanggan</th>
                <th className="text-center px-5 py-3 text-xs font-semibold text-brand-dark/50">Rating</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-brand-dark/50">Komentar</th>
                <th className="text-center px-5 py-3 text-xs font-semibold text-brand-dark/50">Status</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-brand-dark/50">Tanggal</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-brand-dark/50">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.id} className="border-t border-brand-border/30 hover:bg-brand-surface/20">
                  <td className="px-5 py-3">
                    <Link href={`/product/${r.productSlug}`} className="font-medium text-brand-dark hover:text-brand-accent text-xs" target="_blank">
                      {r.productName}
                    </Link>
                  </td>
                  <td className="px-5 py-3">
                    <div>
                      <p className="font-medium text-brand-dark text-xs">{r.customerName}</p>
                      <p className="text-2xs text-brand-dark/40">{r.customerEmail}</p>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-center">
                    <div className="flex items-center justify-center gap-0.5">
                      {[1, 2, 3, 4, 5].map(s => (
                        <span key={s} className={`material-symbols-outlined text-sm ${s <= r.rating ? "text-amber-400" : "text-brand-border"}`} style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-3 max-w-[200px]">
                    {r.title && <p className="text-xs font-semibold text-brand-dark truncate">{r.title}</p>}
                    <p className="text-xs text-brand-dark/60 truncate">{r.comment}</p>
                    {r.photos.length > 0 && (
                      <div className="flex gap-1.5 mt-2">
                        {r.photos.map((url, i) => (
                          <div key={i} className="w-10 h-10 rounded border border-brand-border overflow-hidden">
                            <img src={url} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-3 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-2xs font-semibold ${
                      r.isVerified ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-600"
                    }`}>
                      {r.isVerified ? "Verified" : "Pending"}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-xs text-brand-dark/50">
                    {new Date(r.date).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                  </td>
                  <td className="px-5 py-3 text-right whitespace-nowrap">
                    <button
                      onClick={() => handleToggleVerified(r.id)}
                      className={`text-xs font-semibold hover:underline ${r.isVerified ? "text-amber-600" : "text-emerald-600"}`}
                    >
                      {r.isVerified ? "Unverify" : "Verify"}
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(r.id)}
                      className="text-xs text-red-500 font-semibold hover:underline ml-3"
                    >Hapus</button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-5 py-10 text-center text-xs text-brand-dark/30">Tidak ada ulasan</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {deleteConfirmId && (
        <Portal>
          <div className="fixed inset-0 z-[100] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={() => setDeleteConfirmId(null)} />
            <div className="relative bg-white rounded-xl p-6 max-w-sm shadow-2xl space-y-4">
              <h3 className="font-bold text-brand-dark">Hapus Ulasan?</h3>
              <p className="text-sm text-brand-dark/70">Ulasan akan dihapus permanen.</p>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setDeleteConfirmId(null)}>Batal</Button>
                <Button variant="destructive" className="flex-1" onClick={() => handleDelete(deleteConfirmId)}>Hapus</Button>
              </div>
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
}

// ═══════════════════════════════════════
// Team & Expert Management
// ═══════════════════════════════════════
type StaffProfileItem = {
  id: string;
  shortName: string;
  title: string;
  avatar: string | null;
  staffRole: string;
  isTeamVisible: boolean;
  teamSortOrder: number;
  user: { name: string | null; email: string | null };
  _count: { articles: number; curatedProducts: number };
};

type EligibleUser = {
  id: string;
  name: string | null;
  email: string;
  roleId: number;
};

function TeamManagementSection() {
  const [profiles, setProfiles] = useState<StaffProfileItem[]>([]);
  const [eligibleUsers, setEligibleUsers] = useState<EligibleUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editProfile, setEditProfile] = useState<StaffProfileItem | null>(null);

  const loadData = async () => {
    const [staffData, users] = await Promise.all([
      fetchStaffProfiles(),
      fetchEligibleStaffUsers(),
    ]);
    setProfiles(staffData as StaffProfileItem[]);
    setEligibleUsers(users);
    setIsLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  // ── Form state ──
  const [formUserId, setFormUserId] = useState("");
  const [formShortName, setFormShortName] = useState("");
  const [formTitle, setFormTitle] = useState("");
  const [formBio, setFormBio] = useState("");
  const [formStaffRole, setFormStaffRole] = useState("");
  const [formBadge, setFormBadge] = useState("");
  const [formIsVisible, setFormIsVisible] = useState(true);
  const [formSortOrder, setFormSortOrder] = useState(0);
  const [saving, setSaving] = useState(false);

  const resetForm = () => {
    setFormUserId(""); setFormShortName(""); setFormTitle("");
    setFormBio(""); setFormStaffRole(""); setFormBadge("");
    setFormIsVisible(true); setFormSortOrder(0);
    setEditProfile(null);
  };

  const openCreate = () => {
    resetForm();
    setShowForm(true);
  };

  const openEdit = (p: StaffProfileItem) => {
    setEditProfile(p);
    setFormUserId(p.id);
    setFormShortName(p.shortName);
    setFormTitle(p.title);
    setFormBio("");
    setFormStaffRole(p.staffRole);
    setFormBadge("");
    setFormIsVisible(p.isTeamVisible);
    setFormSortOrder(p.teamSortOrder);
    setShowForm(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editProfile) {
        const result = await updateStaffProfileAction(editProfile.id, {
          shortName: formShortName, title: formTitle,
          bio: formBio || undefined, staffRole: formStaffRole,
          badge: formBadge || undefined,
          isTeamVisible: formIsVisible, teamSortOrder: formSortOrder,
        });
        if (result.success) {
          toast.success("Profil staf diupdate!");
          setShowForm(false); resetForm(); loadData();
        } else toast.error(result.error);
      } else {
        if (!formUserId) { toast.error("Pilih user terlebih dahulu"); setSaving(false); return; }
        const result = await createStaffProfileAction({
          userId: formUserId, shortName: formShortName,
          title: formTitle, bio: formBio, staffRole: formStaffRole,
          badge: formBadge || null, isTeamVisible: formIsVisible,
          teamSortOrder: formSortOrder,
        });
        if (result.success) {
          toast.success("Profil staf berhasil dibuat!");
          setShowForm(false); resetForm(); loadData();
        } else toast.error(result.error);
      }
    } catch { toast.error("Terjadi kesalahan"); }
    finally { setSaving(false); }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-brand-dark/50">{profiles.length} staf terdaftar</p>
        <button
          onClick={openCreate}
          disabled={eligibleUsers.length === 0}
          className="bg-brand-dark text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 hover:bg-brand-dark/90 transition-colors disabled:opacity-50"
          title={eligibleUsers.length === 0 ? "Tidak ada user yang tersedia" : undefined}
        >
          <span className="material-symbols-outlined text-sm">person_add</span>
          Tambah Profil
        </button>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {profiles.map(p => (
          <div key={p.id} className="bg-white rounded-xl border border-brand-border p-5 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-surface flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-brand-dark/30">person</span>
                </div>
                <div className="min-w-0">
                  <h4 className="font-semibold text-sm text-brand-dark truncate">{p.user.name || p.shortName}</h4>
                  <p className="text-2xs text-brand-dark/40 truncate">{p.title}</p>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-2xs font-semibold shrink-0 ${
                p.isTeamVisible ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-600"
              }`}>
                {p.isTeamVisible ? "Visible" : "Hidden"}
              </span>
            </div>
            <div className="flex gap-4 text-2xs text-brand-dark/50">
              <span>{p._count.articles} artikel</span>
              <span>{p._count.curatedProducts} produk</span>
              <span>Order: {p.teamSortOrder}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded-full text-2xs font-semibold bg-blue-50 text-blue-700">{p.staffRole}</span>
              <button
                onClick={() => openEdit(p)}
                className="text-xs text-brand-accent font-semibold hover:underline"
              >Edit</button>
            </div>
          </div>
        ))}
        {profiles.length === 0 && (
          <div className="col-span-full text-center py-10 text-xs text-brand-dark/30">
            Belum ada profil staf. Klik &quot;Tambah Profil&quot; untuk memulai.
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <Portal>
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50" onClick={() => { setShowForm(false); resetForm(); }} />
            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b px-5 py-4 flex items-center justify-between z-10">
                <h3 className="font-bold text-brand-dark">{editProfile ? "Edit Profil Staf" : "Tambah Profil Staf"}</h3>
                <button onClick={() => { setShowForm(false); resetForm(); }}>
                  <span className="material-symbols-outlined text-brand-dark/40">close</span>
                </button>
              </div>
              <div className="p-5 space-y-4">
                {/* User selector (create only) */}
                {!editProfile && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-brand-dark/70">User *</label>
                    <select
                      value={formUserId}
                      onChange={e => setFormUserId(e.target.value)}
                      className="w-full border border-brand-border rounded-lg px-3 py-2 text-sm bg-white"
                    >
                      <option value="">Pilih user...</option>
                      {eligibleUsers.map(u => (
                        <option key={u.id} value={u.id}>{u.name || u.email} ({u.email})</option>
                      ))}
                    </select>
                    <p className="text-2xs text-brand-dark/40">Hanya user non-customer tanpa profil</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-brand-dark/70">Nama Pendek *</label>
                    <input value={formShortName} onChange={e => setFormShortName(e.target.value)} className="w-full border border-brand-border rounded-lg px-3 py-2 text-sm" placeholder="Dr. Hartono" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-brand-dark/70">Staff Role *</label>
                    <input value={formStaffRole} onChange={e => setFormStaffRole(e.target.value)} className="w-full border border-brand-border rounded-lg px-3 py-2 text-sm" placeholder="botanist" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-brand-dark/70">Jabatan / Title *</label>
                  <input value={formTitle} onChange={e => setFormTitle(e.target.value)} className="w-full border border-brand-border rounded-lg px-3 py-2 text-sm" placeholder="Head Botanist · BMJ Nursery" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-brand-dark/70">Bio *</label>
                  <textarea value={formBio} onChange={e => setFormBio(e.target.value)} rows={3} className="w-full border border-brand-border rounded-lg px-3 py-2 text-sm" placeholder="Pengalaman dan keahlian..." />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-brand-dark/70">Badge</label>
                    <input value={formBadge} onChange={e => setFormBadge(e.target.value)} className="w-full border border-brand-border rounded-lg px-3 py-2 text-sm" placeholder="Lead Expert" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-brand-dark/70">Sort Order</label>
                    <input type="number" min={0} value={formSortOrder} onChange={e => setFormSortOrder(Number(e.target.value))} className="w-full border border-brand-border rounded-lg px-3 py-2 text-sm" />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input type="checkbox" id="teamVisible" checked={formIsVisible} onChange={e => setFormIsVisible(e.target.checked)} className="rounded" />
                  <label htmlFor="teamVisible" className="text-xs text-brand-dark/70">Tampilkan di halaman publik</label>
                </div>
              </div>
              <div className="sticky bottom-0 bg-white border-t px-5 py-3 flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => { setShowForm(false); resetForm(); }}>Batal</Button>
                <Button className="flex-1" onClick={handleSave} disabled={saving}>
                  {saving && <span className="material-symbols-outlined text-sm animate-spin mr-1.5">progress_activity</span>}
                  {editProfile ? "Update" : "Simpan"}
                </Button>
              </div>
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
}


function SettingsSection() {
  const [editingKey, setEditingKey] = useState<string | null>(null);

  const settingGroups = [
    {
      title: "Toko",
      items: [
        { key: "shop-name", label: "Nama Toko", value: "Bumi Mekarsari Jaya", icon: "storefront" },
        { key: "shop-email", label: "Email", value: "bumimekarsarijaya@gmail.com", icon: "email" },
        { key: "shop-phone", label: "Telepon", value: "081586664516", icon: "phone" },
        { key: "shop-address", label: "Alamat", value: "Cipanas, Cianjur, Jawa Barat 43253", icon: "location_on" },
      ],
    },
    {
      title: "Pengiriman",
      items: [
        { key: "ship-courier", label: "Kurir Aktif", value: "JNE, SiCepat, J&T", icon: "local_shipping" },
        { key: "ship-free", label: "Gratis Ongkir", value: "Min. Rp 1.000.000", icon: "redeem" },
        { key: "ship-insurance", label: "Asuransi", value: "Aktif (otomatis)", icon: "shield" },
      ],
    },
    {
      title: "Pembayaran",
      items: [
        { key: "pay-bank", label: "Transfer Bank", value: "BCA, Mandiri, BNI", icon: "account_balance" },
        { key: "pay-ewallet", label: "E-Wallet", value: "GoPay, OVO, DANA", icon: "wallet" },
      ],
    },
  ];

  return (
    <div className="space-y-6 max-w-2xl">
      {settingGroups.map(group => (
        <div key={group.title} className="bg-white rounded-xl border border-brand-border p-5">
          <h3 className="text-sm font-bold text-brand-dark mb-4">{group.title}</h3>
          <div className="space-y-0">
            {group.items.map(item => (
              <div key={item.key} className="flex items-center justify-between py-3 border-b border-brand-border/30 last:border-0">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-brand-dark/30 text-lg">{item.icon}</span>
                  <div>
                    <p className="text-xs text-brand-dark/50">{item.label}</p>
                    {editingKey === item.key ? (
                      <input
                        defaultValue={item.value}
                        className="text-sm font-medium text-brand-dark border rounded px-2 py-1 mt-0.5"
                        autoFocus
                        onBlur={() => { setEditingKey(null); toast.success(`${item.label} diupdate`); }}
                        onKeyDown={e => { if (e.key === "Enter") { setEditingKey(null); toast.success(`${item.label} diupdate`); } }}
                      />
                    ) : (
                      <p className="text-sm font-medium text-brand-dark">{item.value}</p>
                    )}
                  </div>
                </div>
                <button onClick={() => setEditingKey(item.key)} className="text-xs text-brand-accent font-semibold hover:underline">Edit</button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
