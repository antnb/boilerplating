import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: ["/manage/", "/dashboard/", "/account/", "/checkout/"],
        },
        sitemap: "https://bmjplantstore.com/sitemap.xml",
    };
}
