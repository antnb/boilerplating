# Knowledge Hub Components

**Purpose:** Components ONLY used in Knowledge Hub pages (`/knowledge/*`).

## Included Components:
- `KnowledgeHero.tsx` - Knowledge hub hero with search
- `ArticleCardFull.tsx` - Article card (vertical, full detail) for knowledge pages
- `CategoryPillNav.tsx` - Category filter pills
- `FeaturedMagazine.tsx` - Featured article layout
- `CategoryGrid.tsx` - Article grid for category pages
- `TableOfContents.tsx` - Sticky TOC for article detail
- `EditorialBoard.tsx` - Expert trust section
- `AuthorCard.tsx` - Author bio card
- `RelatedArticles.tsx` - Related articles section

## Rules:
✅ **DO:** Put components that ONLY appear in knowledge pages
✅ **DO:** Keep knowledge-specific styling and logic here
❌ **DON'T:** Import from homepage/ or product/ folders
❌ **DON'T:** Reuse homepage ArticleCard even if it fetches from same table

## Data:
Articles fetch from `Article` table via `lib/queries/article-queries.ts`
