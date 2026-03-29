// src/lib/utils/sanitize.ts
// NOTE: No "use client" — this utility works in BOTH Server and Client Components
// because isomorphic-dompurify uses jsdom on server and native DOM on client.

import DOMPurify from "isomorphic-dompurify";

/**
 * Sanitizes HTML content to prevent XSS attacks.
 * Works in both Server Components and Client Components.
 *
 * MUST be used anywhere `dangerouslySetInnerHTML` renders user/CMS/external HTML.
 * Do NOT use for JSON-LD (JSON.stringify output is inherently safe).
 */
export function sanitizeHtml(dirty: string): string {
    return DOMPurify.sanitize(dirty, {
        ALLOWED_TAGS: [
            "h1", "h2", "h3", "h4", "h5", "h6",
            "p", "br", "hr",
            "ul", "ol", "li",
            "a", "strong", "em", "b", "i", "u", "s",
            "blockquote", "pre", "code",
            "img", "figure", "figcaption",
            "table", "thead", "tbody", "tr", "th", "td",
            "div", "span", "section", "article",
            "sup", "sub",
        ],
        ALLOWED_ATTR: [
            "href", "target", "rel", "src", "alt", "title",
            "class", "id", "width", "height", "loading",
        ],
        ALLOW_DATA_ATTR: false,
    });
}
