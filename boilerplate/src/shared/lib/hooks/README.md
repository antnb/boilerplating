# Client Hooks

**Purpose:** Custom React hooks for client-side logic.

## Organization:
Organize by **functionality/purpose**:
- `use-cart.ts` - Cart state management (Zustand/Context)
- `use-search.ts` - Search functionality
- `use-infinite-scroll.ts` - Infinite scroll pagination
- `use-media-query.ts` - Responsive breakpoint detection

## Rules:
✅ **DO:** Extract reusable client-side logic
✅ **DO:** Use standard hook naming (`use-*`)
✅ **DO:** Keep hooks framework-agnostic when possible
❌ **DON'T:** Put server logic here
❌ **DON'T:** Fetch data directly (use Server Components + queries instead)

## Example:
```typescript
// use-cart.ts
'use client';

import { create } from 'zustand';

type CartStore = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
};

export const useCart = create<CartStore>((set) => ({
  items: [],
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
  removeItem: (id) => set((state) => ({
    items: state.items.filter((i) => i.id !== id)
  })),
}));
```
