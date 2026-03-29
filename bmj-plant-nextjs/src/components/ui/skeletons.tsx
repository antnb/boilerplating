import { Skeleton } from "@/components/ui/skeleton";

/** Skeleton for a single product card — matches ProductCard layout */
export function ProductCardSkeleton() {
  return (
    <article className="rounded-2xl overflow-hidden border border-border bg-card">
      {/* Image */}
      <Skeleton className="aspect-[4/5] w-full" />
      {/* Info */}
      <div className="p-3 space-y-2">
        <Skeleton className="h-3 w-2/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-3 w-1/3" />
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-8 w-8 rounded-lg" />
        </div>
      </div>
    </article>
  );
}

/** Grid of product card skeletons */
export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <ul role="list" id="product-grid" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <li key={i}>
          <ProductCardSkeleton />
        </li>
      ))}
    </ul>
  );
}

/** Skeleton for sidebar categories */
export function SidebarSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-5 w-24" />
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-center justify-between">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-6 rounded-full" />
        </div>
      ))}
      <Skeleton className="h-px w-full my-4" />
      <Skeleton className="h-5 w-20" />
      <Skeleton className="h-8 w-full rounded-lg" />
    </div>
  );
}

/** Skeleton for dashboard stat cards */
export function StatCardSkeleton() {
  return (
    <div className="bg-card rounded-xl p-4 md:p-5 border border-border">
      <div className="flex items-center justify-between mb-3">
        <Skeleton className="h-5 w-5 rounded" />
        <Skeleton className="h-4 w-12 rounded-full" />
      </div>
      <Skeleton className="h-6 w-32 mb-1" />
      <Skeleton className="h-3 w-16" />
    </div>
  );
}

/** Skeleton for a table row */
export function TableRowSkeleton({ cols = 6 }: { cols?: number }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  );
}

/** Skeleton for order cards */
export function OrderCardSkeleton() {
  return (
    <div className="bg-card rounded-xl p-4 border border-border space-y-3">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-28" />
        <Skeleton className="h-8 w-16 rounded" />
      </div>
    </div>
  );
}

/** Skeleton for cart items */
export function CartItemSkeleton() {
  return (
    <div className="flex gap-3">
      <Skeleton className="w-20 h-20 rounded-lg flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
  );
}

/** Skeleton for wishlist cards */
export function WishlistCardSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden border border-border bg-card">
      <Skeleton className="aspect-square w-full" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-5 w-24" />
        <div className="flex gap-2 pt-1">
          <Skeleton className="h-8 flex-1 rounded" />
          <Skeleton className="h-8 w-8 rounded" />
        </div>
      </div>
    </div>
  );
}
