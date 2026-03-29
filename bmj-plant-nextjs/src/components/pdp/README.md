# Product Components

**Purpose:** Components ONLY used in product/shop pages (`/product/*`).

## Included Components:
- `ProductCard.tsx` - Product card for product listing
- `ProductGrid.tsx` - Product grid with filters
- `FilterSidebar.tsx` - Filter sidebar (categories, price, etc)
- `ProductGallery.tsx` - Product detail image gallery
- `ProductInfo.tsx` - Product detail info section
- `AddToCartButton.tsx` - Add to cart interaction

## Rules:
✅ **DO:** Put components that ONLY appear in product pages
✅ **DO:** Keep product-specific logic here
❌ **DON'T:** Import from homepage/ or knowledge/
❌ **DON'T:** Mix product components with homepage showcase components

## Data:
Products fetch from `Plant` table via `lib/queries/product-queries.ts`
