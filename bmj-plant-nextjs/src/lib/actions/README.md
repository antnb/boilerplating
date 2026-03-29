# Server Actions

**Purpose:** Server-side operations — mutations AND reads while using mock data.

## Current State (Mock Data Phase)
All functions are colocated in action files with `"use server"` directive.
Reads and mutations live side-by-side because there's no real database yet.

## Future State (Real API Phase)
When real API/DB is integrated, separate into:
- `lib/actions/` — Mutations only (create, update, delete)  
- `lib/queries/` — Read operations (get, list, find)

## Organization:
Organize by **domain/entity**, not by page:
- `address-actions.ts` — Address CRUD + listing
- `order-actions.ts` — Order creation + history
- `cart-actions.ts` — Cart operations
- `customer-actions.ts` — Customer registration + profile
- `profile-actions.ts` — Profile updates + password change
- `review-actions.ts` — Review submission + listing
- `wishlist-actions.ts` — Wishlist add/remove/list

## Rules:
✅ **DO:** Use `'use server'` directive as first line
✅ **DO:** Return `ActionState<T>` type from mutations (see `types.ts`)
✅ **DO:** Validate inputs (Zod for complex, manual for simple)
✅ **DO:** Group by domain (Address, Product, Cart, etc.)
❌ **DON'T:** Organize by page
❌ **DON'T:** Import browser APIs (window, document, etc.)

## Shared Type:
```typescript
// types.ts
export type ActionState<T = undefined> = {
    success: boolean;
    error?: string;
    data?: T;
};
```

## Example:
```typescript
// address-actions.ts
'use server';

import type { ActionState } from './types';
import { addressSchema } from '@/lib/validations/address';

export async function createAddress(data: AddressInput): Promise<ActionState<{ id: string }>> {
    const parsed = addressSchema.safeParse(data);
    if (!parsed.success) {
        return { success: false, error: parsed.error.errors[0].message };
    }
    // DB operation
    return { success: true, data: { id: 'new-id' } };
}
```
