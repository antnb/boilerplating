// Order types — extracted from mock-dashboard.ts and mock-admin-extra.ts
// Used by: StaffDashboardPage, BuyerDashboardPage, OrderSlideOver, CustomerDetail

export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

export interface AdminOrderDetail {
  id: string;
  customer: string;
  email: string;
  phone: string;
  date: string;
  status: OrderStatus;
  total: number;
  subtotal: number;
  shippingCost: number;
  discount: number;
  items: { name: string; sku: string; qty: number; price: number; image: string }[];
  address: { recipient: string; address: string; city: string; province: string; postal: string };
  tracking: { courier: string; resi: string; lastUpdate: string } | null;
  notes: string;
  paymentMethod: string;
  paymentProof: string | null;
  timeline: { status: string; date: string; note: string }[];
}
