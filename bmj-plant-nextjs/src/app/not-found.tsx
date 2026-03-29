// Server Component — imports Client NotFoundPage
// NOTE: not-found.tsx does NOT support `export const metadata` in Next.js.
// 404 page title is handled via the root layout's metadata template.
import NotFoundPage from "@/views/NotFoundPage";

export default function NotFound() {
    return <NotFoundPage />;
}
