// E-commerce Types for Cart, Wishlist, Address, and Orders

export interface CartItem {
  id: string;
  cart_id: string;
  plant_id: string;
  quantity: number;
  created_at: string;
  plant?: {
    id: string;
    slug?: string;
    name: string;
    scientific_name: string | null;
    price: number | null;
    stock: number | null;
    image_url: string | null;
    stock_status: string | null;
  };
}

export interface Cart {
  id: string;
  customer_id: string | null;
  session_id: string | null;
  expires_at: string;
  created_at: string;
  updated_at: string;
  items?: CartItem[];
}

export interface WishlistItem {
  id: string;
  customer_id: string;
  plant_id: string;
  created_at: string;
  plant?: {
    id: string;
    slug?: string;
    name: string;
    scientific_name: string | null;
    price: number | null;
    stock: number | null;
    image_url: string | null;
    stock_status: string | null;
    variety?: {
      name: string;
    };
  };
}

export interface Address {
  id: string;
  customer_id: string;
  label: string;
  recipient_name: string;
  phone: string;
  address_line_1: string;
  address_line_2: string | null;
  city: string;
  province: string;
  postal_code: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface AddressFormData {
  label: string;
  recipient_name: string;
  phone: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  province: string;
  postal_code: string;
  is_default?: boolean;
}

export type OrderStatus = 
  | 'pending' 
  | 'paid' 
  | 'processing' 
  | 'shipped' 
  | 'delivered' 
  | 'completed' 
  | 'cancelled' 
  | 'returned';

export type PaymentStatus = 
  | 'unpaid' 
  | 'pending' 
  | 'paid' 
  | 'failed' 
  | 'refunded';

export type InquiryStatus = 
  | 'pending' 
  | 'reviewing' 
  | 'quoted' 
  | 'accepted' 
  | 'rejected' 
  | 'expired';
