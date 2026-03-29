import { PrismaClient, Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import { articleContent } from "./seed-article-content";
import { pageContentData } from "./seed-page-content";

const prisma = new PrismaClient();

// ── Helper: parse "Rp 3.800.000" → 3800000 ──
function parsePrice(s: string | null | undefined): number {
    if (!s) return 0;
    return parseInt(s.replace(/[^0-9]/g, "")) || 0;
}

async function main() {
    console.log("🌱 Seeding database...\n");

    // ════════════════════════════════════════════════════════════
    // 0. ROLES (must seed first — users reference roleId FK)
    // ════════════════════════════════════════════════════════════
    const roleData = [
        { id: 1, name: "admin", label: "Administrator" },
        { id: 2, name: "writer", label: "Penulis" },
        { id: 3, name: "expert", label: "Ahli Tanaman" },
        { id: 4, name: "staff", label: "Staf" },
        { id: 5, name: "customer", label: "Pelanggan" },
    ];

    for (const r of roleData) {
        await prisma.role.upsert({
            where: { id: r.id },
            update: { name: r.name, label: r.label },
            create: r,
        });
    }
    console.log(`  ✅ Roles: ${roleData.length}`);

    // ════════════════════════════════════════════════════════════
    // 1. USERS
    // ════════════════════════════════════════════════════════════
    const adminPw = await bcrypt.hash("admin123", 10);
    const admin = await prisma.user.upsert({
        where: { email: "admin@bmj.com" },
        update: {},
        create: {
            email: "admin@bmj.com",
            name: "Admin BMJ",
            hashedPassword: adminPw,
            roleId: 1, // admin
        },
    });
    console.log(`  ✅ Admin: ${admin.email}`);

    const custPw = await bcrypt.hash("customer123", 10);
    const customer = await prisma.user.upsert({
        where: { email: "ahmad.rizki@email.com" },
        update: {},
        create: {
            email: "ahmad.rizki@email.com",
            name: "Ahmad Rizki",
            phone: "081234567890",
            hashedPassword: custPw,
            roleId: 5, // customer
        },
    });
    console.log(`  ✅ Customer: ${customer.email}`);

    // Legacy demo customer
    const demoPw = await bcrypt.hash("customer123", 10);
    const demoCustomer = await prisma.user.upsert({
        where: { email: "customer@example.com" },
        update: {},
        create: {
            email: "customer@example.com",
            name: "Customer Demo",
            phone: "081234567890",
            hashedPassword: demoPw,
            roleId: 5, // customer
        },
    });
    console.log(`  ✅ Demo: ${demoCustomer.email}`);

    // ════════════════════════════════════════════════════════════
    // 2. CATEGORIES
    // ════════════════════════════════════════════════════════════
    const categoryData = [
        { name: "Monstera", slug: "monstera", description: "Tanaman genus Monstera dengan daun ikonik", sortOrder: 1 },
        { name: "Philodendron", slug: "philodendron", description: "Genus Philodendron dari famili Araceae", sortOrder: 2 },
        { name: "Anthurium", slug: "anthurium", description: "Tanaman berbunga dari famili Araceae", sortOrder: 3 },
        { name: "Alocasia", slug: "alocasia", description: "Tanaman dengan daun dramatis dan eksotis", sortOrder: 4 },
        { name: "Syngonium", slug: "syngonium", description: "Tanaman merambat cocok pemula", sortOrder: 5 },
        { name: "Calathea", slug: "calathea", description: "Tanaman prayer plant dengan daun bermotif", sortOrder: 6 },
        { name: "Fern", slug: "fern", description: "Pakis hias", sortOrder: 7 },
        { name: "Succulent", slug: "succulent", description: "Tanaman sukulen", sortOrder: 8 },
        { name: "Accessories", slug: "accessories", description: "Pot, media tanam, dan perlengkapan", sortOrder: 9 },
    ];

    const categories: Record<string, string> = {};
    for (const cat of categoryData) {
        const created = await prisma.category.upsert({
            where: { slug: cat.slug },
            update: {},
            create: cat,
        });
        categories[cat.slug] = created.id;
    }
    console.log(`  ✅ Categories: ${categoryData.length}`);

    // ════════════════════════════════════════════════════════════
    // 3. PRODUCTS (from mock-plants.ts)
    // ════════════════════════════════════════════════════════════
    const plants = [
        {
            slug: "monstera-albo-variegata",
            sku: "MON-AV-001",
            name: "Monstera Albo Borsigiana Variegata",
            scientificName: "Monstera deliciosa 'Albo Borsigiana'",
            basePrice: "Rp 3.800.000",
            discountPrice: null,
            discountPct: 0,
            stock: 2,
            careDifficulty: 3,
            sizeOptions: ["S (3 Daun)", "M (5 Daun)", "L (Top Cutting)"],
            labels: ["Rare", "Variegated", "Collector's Item"],
            description: "Monstera Albo Borsigiana adalah salah satu aroids paling diburu di dunia karena mutasi genetik yang menghasilkan warna putih solid (variegasi) pada daunnya.",
            specs: {
                light: "Bright Indirect",
                water: "Moderate (Keringkan topsoil 2cm)",
                soil: "Chunky Aroid Mix",
                humidity: "60% - 80%",
                temperature: "18°C - 28°C",
                toxicity: "Toxic to Pets",
                // Extended specs
                height: "40-60cm",
                potSize: "20cm",
                growthRate: "Sedang",
                careTips: "Bersihkan daun secara berkala. Hindari air menggenang pada pot.",
                handling: "Gunakan sarung tangan saat memangkas atau memindahkan tanaman.",
                originRegions: ["Kolombia", "Ekuador", "Peru"],
                habitat: "Hutan Hujan Tropis, tumbuh sebagai epifit di ketinggian 500-2000 mdpl",
                usageTags: [
                    { icon: "home", label: "Indoor" },
                    { icon: "park", label: "Outdoor Teduh" },
                    { icon: "air", label: "Air Purifier" },
                ],
                benefits: [
                    { icon: "air", label: "Pembersih Udara", description: "Membantu memfilter polutan udara dalam ruangan." },
                    { icon: "spa", label: "Estetika", description: "Variegasi unik menjadi focal point ruangan." },
                ],
                careDetails: {
                    light: "Cahaya terang tidak langsung. Hindari sinar matahari langsung yang bisa membakar daun variegata.",
                    water: "Siram saat media tanam bagian atas kering 2cm. Jangan biarkan akar terendam air.",
                    humidity: "Semprot daun secara rutin atau gunakan humidifier. Kelembapan ideal 60-80%.",
                    difficulty: "Butuh perhatian khusus untuk menjaga konsistensi variegasi putih.",
                },
                packagingType: "POTTED",
            },
            category: "monstera",
            images: [
                { url: "/images/products/greenhouse-interior.webp", alt: "Monstera Albo Front" },
                { url: "/images/products/bonsai-1.webp", alt: "Monstera Albo Leaf Detail" },
                { url: "/images/products/bonsai-2.webp", alt: "Monstera Albo Stem" },
            ],
        },
        {
            slug: "philodendron-pink-princess",
            sku: "PHI-PP-001",
            name: "Philodendron Pink Princess",
            scientificName: "Philodendron erubescens 'Pink Princess'",
            basePrice: "Rp 850.000",
            discountPrice: "Rp 650.000",
            discountPct: 23,
            stock: 8,
            careDifficulty: 2,
            sizeOptions: ["M (4-5 Daun)"],
            labels: ["Sale", "Beginner Friendly"],
            description: "Philodendron Pink Princess (PPP) adalah mutasi cantik dari P. erubescens dengan warna pink bubblegum.",
            specs: { light: "Medium to Bright Indirect", water: "Allow top half to dry", soil: "Aroid Mix", humidity: "50% - 70%", temperature: "18°C - 28°C", toxicity: "Toxic to Pets" },
            category: "philodendron",
            images: [{ url: "/images/products/bonsai-1.webp", alt: "Pink Princess" }],
        },
        {
            slug: "anthurium-crystallinum",
            sku: "ANT-CR-001",
            name: "Anthurium Crystallinum",
            scientificName: "Anthurium crystallinum",
            basePrice: "Rp 450.000",
            discountPrice: null,
            discountPct: 0,
            stock: 15,
            careDifficulty: 3,
            sizeOptions: ["S", "M"],
            labels: ["Velvety", "Iconic"],
            description: "Dikenal dengan daun beludru bentuk hati dan urat daun kristal putih/silver.",
            specs: { light: "Medium Indirect", water: "Keep evenly moist", soil: "High Drainage Aroid", humidity: "70%+", temperature: "20°C - 28°C", toxicity: "Toxic" },
            category: "anthurium",
            images: [{ url: "/images/products/bonsai-2.webp", alt: "Crystallinum" }],
        },
        {
            slug: "alocasia-dragon-scale",
            sku: "ALO-DS-001",
            name: "Alocasia Dragon Scale",
            scientificName: "Alocasia baginda 'Dragon Scale'",
            basePrice: "Rp 750.000",
            discountPrice: null,
            discountPct: 0,
            stock: 0,
            careDifficulty: 4,
            sizeOptions: ["S", "M"],
            labels: ["Exotic", "Statement Plant"],
            description: "Tekstur daun seperti sisik naga dengan warna hijau tua metalik yang memukau.",
            specs: { light: "Bright Indirect", water: "Keep moist, not wet", soil: "Well-draining Aroid Mix", humidity: "60% - 80%", temperature: "18°C - 26°C", toxicity: "Toxic to Pets" },
            category: "alocasia",
            images: [{ url: "/images/products/garden-path.webp", alt: "Dragon Scale" }],
        },
        {
            slug: "philodendron-gloriosum",
            sku: "PHI-GL-001",
            name: "Philodendron Gloriosum",
            scientificName: "Philodendron gloriosum",
            basePrice: "Rp 1.200.000",
            discountPrice: null,
            discountPct: 0,
            stock: 0,
            careDifficulty: 2,
            sizeOptions: ["M (3 Daun)", "L (5 Daun)"],
            labels: ["Trending", "Crawler"],
            description: "Philodendron crawler dengan daun hijau beludru besar dan urat putih yang kontras.",
            specs: { light: "Medium to Bright Indirect", water: "When top 2 inches dry", soil: "Chunky Aroid Mix", humidity: "60% - 80%", temperature: "18°C - 28°C", toxicity: "Toxic" },
            category: "philodendron",
            images: [{ url: "/images/products/greenhouse-interior.webp", alt: "Gloriosum" }],
        },
        {
            slug: "syngonium-pink-splash",
            sku: "SYN-T25-001",
            name: "Syngonium Pink Splash",
            scientificName: "Syngonium podophyllum 'Pink Splash'",
            basePrice: "Rp 185.000",
            discountPrice: null,
            discountPct: 0,
            stock: 25,
            careDifficulty: 1,
            sizeOptions: ["S", "M"],
            labels: ["Beginner", "Budget Friendly"],
            description: "Tanaman merambat dengan splash pink cantik, cocok untuk pemula.",
            specs: { light: "Low to Bright Indirect", water: "When soil is dry", soil: "Standard Potting Mix", humidity: "40% - 70%", temperature: "15°C - 30°C", toxicity: "Toxic" },
            category: "syngonium",
            images: [{ url: "/images/products/bonsai-1.webp", alt: "Pink Splash" }],
        },
        {
            slug: "calathea-orbifolia",
            sku: "CAL-OR-001",
            name: "Calathea Orbifolia",
            scientificName: "Goeppertia orbifolia",
            basePrice: "Rp 320.000",
            discountPrice: "Rp 280.000",
            discountPct: 12,
            stock: 10,
            careDifficulty: 4,
            sizeOptions: ["M", "L"],
            labels: ["Pet Safe", "Air Purifier"],
            description: "Daun bulat besar dengan garis-garis silver, aman untuk hewan peliharaan.",
            specs: { light: "Low to Medium Indirect", water: "Keep consistently moist", soil: "Peat-based Mix", humidity: "60% - 80%", temperature: "18°C - 24°C", toxicity: "Non-toxic" },
            category: "calathea",
            images: [{ url: "/images/pages/nursery-main.webp", alt: "Orbifolia" }],
        },
        {
            slug: "monstera-thai-constellation",
            sku: "MON-TC-001",
            name: "Monstera Thai Constellation",
            scientificName: "Monstera deliciosa 'Thai Constellation'",
            basePrice: "Rp 5.500.000",
            discountPrice: null,
            discountPct: 0,
            stock: 3,
            careDifficulty: 3,
            sizeOptions: ["S (2 Daun)", "M (4 Daun)"],
            labels: ["Premium", "Stable Variegation"],
            description: "Variegasi lebih stabil dari Albo dengan pola cream-speckled yang khas.",
            specs: { light: "Bright Indirect", water: "When top 2 inches dry", soil: "Chunky Aroid Mix", humidity: "60% - 80%", temperature: "18°C - 28°C", toxicity: "Toxic to Pets" },
            category: "monstera",
            images: [{ url: "/images/products/bonsai-2.webp", alt: "Thai Constellation" }],
        },
    ];

    const productIds: Record<string, string> = {};
    for (const p of plants) {
        const price = p.discountPrice ? parsePrice(p.discountPrice) : parsePrice(p.basePrice);
        const compareAt = p.discountPrice ? parsePrice(p.basePrice) : null;

        const product = await prisma.product.upsert({
            where: { slug: p.slug },
            update: {},
            create: {
                slug: p.slug,
                sku: p.sku,
                name: p.name,
                scientificName: p.scientificName,
                description: p.description,
                price: new Prisma.Decimal(price),
                compareAtPrice: compareAt ? new Prisma.Decimal(compareAt) : null,
                discountPct: p.discountPct,
                stock: p.stock,
                careDifficulty: p.careDifficulty,
                sizeOptions: p.sizeOptions,
                labels: p.labels,
                specs: p.specs,
                isActive: true,
                categoryId: categories[p.category],
                images: {
                    create: p.images.map((img, i) => ({
                        url: img.url,
                        alt: img.alt,
                        sortOrder: i,
                    })),
                },
            },
        });
        productIds[p.slug] = product.id;
    }
    console.log(`  ✅ Products: ${plants.length}`);

    // Link expert to first product for E-E-A-T demo
    // (expert is created later in section 8, so we do this after expert creation)
    // We store productIds for now and link after expert is created

    // ════════════════════════════════════════════════════════════
    // 4. REVIEWS (sample reviews for products)
    // ════════════════════════════════════════════════════════════
    const reviewData = [
        { productSlug: "monstera-albo-variegata", rating: 5, title: "Sangat Bagus", comment: "Tanaman datang dalam kondisi segar dan sesuai deskripsi. Variegasi sangat cantik!", isVerified: true },
        { productSlug: "monstera-albo-variegata", rating: 4, title: "Pengiriman Cepat", comment: "Packing aman, daun sedikit terlipat tapi masih wajar.", isVerified: true },
        { productSlug: "philodendron-pink-princess", rating: 5, title: "Pink nya cantik sekali", comment: "Warna pink sangat cerah, langsung jadi focal point koleksi saya.", isVerified: true },
        { productSlug: "anthurium-crystallinum", rating: 5, title: "Specimen sempurna", comment: "Venasi kristal sangat jelas, daun sehat dan tebal.", isVerified: true },
        { productSlug: "monstera-thai-constellation", rating: 5, title: "Worth every penny", comment: "Variegasi stabil, pertumbuhan bagus setelah 2 bulan.", isVerified: true },
    ];

    for (const r of reviewData) {
        const pid = productIds[r.productSlug];
        if (!pid) continue;
        // Use upsert with unique [userId, productId]
        await prisma.review.upsert({
            where: { userId_productId: { userId: customer.id, productId: pid } },
            update: {},
            create: {
                rating: r.rating,
                title: r.title,
                comment: r.comment,
                isVerified: r.isVerified,
                userId: customer.id,
                productId: pid,
            },
        });
    }
    console.log(`  ✅ Reviews: ${reviewData.length}`);

    // ════════════════════════════════════════════════════════════
    // 5. ADDRESSES (from mock-dashboard buyer addresses)
    // ════════════════════════════════════════════════════════════
    const addresses = [
        { label: "Rumah", recipientName: "Ahmad Rizki", phone: "081234567890", streetAddress: "Jl. Merdeka No. 45, Menteng", city: "Jakarta Pusat", province: "DKI Jakarta", postalCode: "10310", isDefault: true },
        { label: "Kantor", recipientName: "Ahmad Rizki", phone: "081234567890", streetAddress: "Gedung Graha Mandiri Lt. 5, Jl. Sudirman Kav. 12", city: "Jakarta Selatan", province: "DKI Jakarta", postalCode: "12190", isDefault: false },
    ];

    // Clear existing seed addresses for this user before re-creating (idempotent)
    await prisma.address.deleteMany({ where: { userId: customer.id } });
    for (const addr of addresses) {
        await prisma.address.create({
            data: { ...addr, userId: customer.id },
        });
    }
    console.log(`  ✅ Addresses: ${addresses.length}`);

    // ════════════════════════════════════════════════════════════
    // 6. COUPONS (from mock-coupons.ts + mock-admin-extra.ts)
    // ════════════════════════════════════════════════════════════
    const coupons = [
        { code: "WELCOME10", description: "Diskon 10% untuk pembelian pertama", type: "percentage", value: 10, minOrderAmount: 200000, maxDiscount: 500000, usageLimit: 100, usageCount: 45, isActive: true, validUntil: new Date("2026-12-31") },
        { code: "HEMAT50K", description: "Potongan Rp 50.000", type: "fixed", value: 50000, minOrderAmount: 300000, maxDiscount: null, usageLimit: 50, usageCount: 23, isActive: true, validUntil: new Date("2026-06-30") },
        { code: "GRATISONGKIR", description: "Gratis ongkos kirim", type: "free_shipping", value: 0, minOrderAmount: 500000, maxDiscount: null, usageLimit: 200, usageCount: 67, isActive: true, validUntil: new Date("2026-12-31") },
        { code: "PLANT25", description: "Diskon 25% untuk koleksi rare plant", type: "percentage", value: 25, minOrderAmount: 1000000, maxDiscount: 750000, usageLimit: 100, usageCount: 0, isActive: true, validUntil: new Date("2026-09-30") },
        { code: "EXPIRED01", description: "Kupon kadaluarsa", type: "percentage", value: 50, minOrderAmount: 0, maxDiscount: null, usageLimit: 0, usageCount: 0, isActive: false, validUntil: new Date("2024-01-01") },
    ];

    for (const c of coupons) {
        await prisma.coupon.upsert({
            where: { code: c.code },
            update: {},
            create: {
                code: c.code,
                description: c.description,
                type: c.type,
                value: new Prisma.Decimal(c.value),
                minOrderAmount: new Prisma.Decimal(c.minOrderAmount),
                maxDiscount: c.maxDiscount ? new Prisma.Decimal(c.maxDiscount) : null,
                usageCount: c.usageCount,
                usageLimit: c.usageLimit,
                isActive: c.isActive,
                validUntil: c.validUntil,
            },
        });
    }
    console.log(`  ✅ Coupons: ${coupons.length}`);

    // ════════════════════════════════════════════════════════════
    // 7. ORDERS + ORDER ITEMS + TIMELINE (from mock-dashboard)
    // ════════════════════════════════════════════════════════════
    const orders = [
        {
            orderNumber: "ORD-20250301",
            status: "delivered",
            subtotal: 2850000,
            discount: 0,
            shippingCost: 25000,
            total: 2875000,
            date: "2025-03-01",
            paymentMethod: "Bank Transfer (BCA)",
            trackingCourier: "JNE",
            trackingNumber: "TLKM2025030100123",
            trackingLastUpdate: "Diterima di Jakarta",
            items: [
                { name: "Monstera Albo Variegata", sku: "MON-AV-001", qty: 1, price: 2500000 },
                { name: "Pot Keramik Premium 30cm", sku: "POT-KP-001", qty: 1, price: 350000 },
            ],
            timeline: [
                { status: "pending", date: "2025-03-01 10:00", note: "Pesanan dibuat" },
                { status: "processing", date: "2025-03-01 14:00", note: "Pembayaran dikonfirmasi" },
                { status: "shipped", date: "2025-03-02 08:00", note: "Dikirim via JNE" },
                { status: "delivered", date: "2025-03-04 15:00", note: "Diterima" },
            ],
        },
        {
            orderNumber: "ORD-20250215",
            status: "shipped",
            subtotal: 1750000,
            discount: 0,
            shippingCost: 25000,
            total: 1775000,
            date: "2025-02-15",
            paymentMethod: "Bank Transfer (Mandiri)",
            trackingCourier: "SiCepat",
            trackingNumber: "SCP20250215456",
            trackingLastUpdate: "Dalam pengiriman ke Bandung",
            items: [
                { name: "Philodendron Pink Princess", sku: "PHI-PP-001", qty: 1, price: 1750000 },
            ],
            timeline: [
                { status: "pending", date: "2025-02-15 09:00", note: "Pesanan dibuat" },
                { status: "processing", date: "2025-02-15 14:00", note: "Pembayaran dikonfirmasi" },
                { status: "shipped", date: "2025-02-16 08:00", note: "Dikirim via SiCepat" },
            ],
        },
        {
            orderNumber: "ORD-20250210",
            status: "processing",
            subtotal: 950000,
            discount: 0,
            shippingCost: 25000,
            total: 975000,
            date: "2025-02-10",
            paymentMethod: "GoPay",
            trackingCourier: null,
            trackingNumber: null,
            trackingLastUpdate: null,
            items: [
                { name: "Anthurium Crystallinum", sku: "ANT-CR-001", qty: 1, price: 650000 },
                { name: "Media Tanam Premium 5L", sku: "MED-PR-001", qty: 2, price: 150000 },
            ],
            timeline: [
                { status: "pending", date: "2025-02-10 09:00", note: "Pesanan dibuat" },
                { status: "processing", date: "2025-02-10 15:00", note: "Pembayaran dikonfirmasi" },
            ],
        },
    ];

    for (const o of orders) {
        // Check if order already exists (idempotent re-run)
        const existing = await prisma.order.findUnique({ where: { orderNumber: o.orderNumber } });
        if (existing) {
            // Clean children so we can re-create them fresh
            await prisma.orderTimeline.deleteMany({ where: { orderId: existing.id } });
            await prisma.orderItem.deleteMany({ where: { orderId: existing.id } });
            await prisma.order.delete({ where: { id: existing.id } });
        }
        await prisma.order.create({
            data: {
                orderNumber: o.orderNumber,
                status: o.status,
                subtotal: new Prisma.Decimal(o.subtotal),
                discount: new Prisma.Decimal(o.discount),
                shippingCost: new Prisma.Decimal(o.shippingCost),
                total: new Prisma.Decimal(o.total),
                addressSnapshot: { recipient: "Ahmad Rizki", address: "Jl. Merdeka No. 45", city: "Jakarta Pusat", province: "DKI Jakarta", postal: "10310" },
                paymentMethod: o.paymentMethod,
                trackingCourier: o.trackingCourier,
                trackingNumber: o.trackingNumber,
                trackingLastUpdate: o.trackingLastUpdate,
                createdAt: new Date(o.date),
                userId: customer.id,
                items: {
                    create: o.items.map((item) => ({
                        productName: item.name,
                        sku: item.sku,
                        quantity: item.qty,
                        unitPrice: new Prisma.Decimal(item.price),
                    })),
                },
                timeline: {
                    create: o.timeline.map((tl) => ({
                        status: tl.status,
                        note: tl.note,
                        createdAt: new Date(tl.date),
                    })),
                },
            },
        });
    }
    console.log(`  ✅ Orders: ${orders.length} (with items + timeline)`);

    // ════════════════════════════════════════════════════════════
    // 8. STAFF USERS + STAFF PROFILES (replaces Expert)
    // ════════════════════════════════════════════════════════════

    // Create staff user account for Dr. Hartono
    const hartonoPw = await bcrypt.hash("staff123", 10);
    const hartonoUser = await prisma.user.upsert({
        where: { email: "hartono@bmj.com" },
        update: {},
        create: {
            email: "hartono@bmj.com",
            name: "Dr. Hartono Sumardjo",
            hashedPassword: hartonoPw,
            roleId: 3, // expert
        },
    });
    console.log(`  ✅ Staff User: ${hartonoUser.email}`);

    // Create StaffProfile linked to hartonoUser (shared PK)
    const hartonoProfile = await prisma.staffProfile.upsert({
        where: { id: hartonoUser.id },
        update: {},
        create: {
            id: hartonoUser.id,  // SHARED PK with User
            shortName: "Dr. Hartono",
            title: "Head Botanist · BMJ Nursery",
            bio: "Ahli botani tropis dengan pengalaman 15+ tahun di bidang taksonomi Araceae dan kultivasi tanaman langka. Memimpin program riset dan quality control di jaringan nursery BMJ Cipanas.",
            avatar: "/images/knowledge/knowledge-editorial-team.webp",
            badge: "Lead Expert",
            verificationNote: "Artikel ini telah diverifikasi secara ilmiah oleh tim ahli BMJ Nursery.",
            staffRole: "botanist",
            isTeamVisible: true,
            teamSortOrder: 1,
        },
    });
    console.log(`  ✅ StaffProfile: ${hartonoProfile.shortName}`);

    // Link staff to first product for E-E-A-T demo
    if (productIds["monstera-albo-variegata"]) {
        await prisma.product.update({
            where: { id: productIds["monstera-albo-variegata"] },
            data: { curatorId: hartonoProfile.id },
        });
        console.log("  ✅ Curator linked to Monstera Albo");
    }


    // ════════════════════════════════════════════════════════════
    // 9. ARTICLES (from mock-articles.ts) — 10 articles
    // ════════════════════════════════════════════════════════════
    const articleData = [
        { slug: "panduan-identifikasi-hybrid-philodendron", title: "Panduan Identifikasi Hybrid Philodendron", subtitle: "Pelajari cara membedakan hybrid Philodendron kompleks melalui analisis morfologi daun.", heroImage: "/images/knowledge/knowledge-featured-philodendron.webp", heroImageAlt: "Daun Philodendron hybrid close-up", author: "Dr. Hartono S.", category: "Identifikasi Spesies", readTime: "8 min read", zone: "mengenal", sortOrder: 1 },
        { slug: "taksonomi-araceae", title: "Taksonomi Famili Araceae", subtitle: "Dasar klasifikasi botani untuk identifikasi akurat famili Araceae.", heroImage: "/images/knowledge/knowledge-mengenal-botany.webp", heroImageAlt: "Ilustrasi taksonomi botani Araceae", author: "Dr. Hartono S.", category: "Mengenal · Taksonomi", readTime: "10 min read", zone: "mengenal", sortOrder: 2 },
        { slug: "inspeksi-kesehatan-tanaman", title: "Panduan Inspeksi Kesehatan Tanaman", subtitle: "Panduan visual mendeteksi penyakit, hama, dan masalah akar.", heroImage: "/images/knowledge/knowledge-memilih-selection.webp", heroImageAlt: "Inspeksi kesehatan tanaman", author: "Tim Ahli BMJ", category: "Memilih · Seleksi", readTime: "6 min read", zone: "memilih", sortOrder: 1 },
        { slug: "variegasi-monstera", title: "Teknik Menjaga Variegasi Stabil", subtitle: "Panduan lengkap mempertahankan variegasi pada Monstera.", heroImage: "/images/knowledge/knowledge-monstera.webp", heroImageAlt: "Monstera Thai Constellation", author: "Dr. Hartono S.", category: "Merawat · Variegasi", readTime: "7 min read", zone: "merawat", sortOrder: 1 },
        { slug: "cutting-vs-tanaman-utuh", title: "Cutting vs Tanaman Utuh: Investasi Cerdas", subtitle: "Analisis lengkap dari segi biaya, risiko, dan potensi pertumbuhan.", heroImage: "/images/knowledge/knowledge-cutting.webp", heroImageAlt: "Plant cuttings rooting", author: "Tim Ahli BMJ", category: "Memilih · Investasi", readTime: "5 min read", zone: "memilih", sortOrder: 2 },
        { slug: "interior-tanaman-ruang-gelap", title: "Solusi Tanaman untuk Ruang Minim Cahaya", subtitle: "Daftar tanaman yang bertahan di kondisi low-light.", heroImage: "/images/knowledge/knowledge-interior.webp", heroImageAlt: "Interior styling dengan tanaman", author: "Tim Desain BMJ", category: "Menggunakan · Interior", readTime: "5 min read", zone: "menggunakan", sortOrder: 1 },
        { slug: "tropical-garden-modern", title: "Tropical Garden Modern", subtitle: "Elemen hardscape minimalis berpadu dengan tanaman tropis lush.", heroImage: "/images/knowledge/knowledge-landscape.webp", heroImageAlt: "Desain taman tropis modern", author: "Tim Landscape BMJ", category: "Menggunakan · Landscape", readTime: "6 min read", zone: "menggunakan", sortOrder: 2 },
        { slug: "anthurium-hybrid-market-2024", title: "Anthurium Papillilaminum Hybrid Market 2024", subtitle: "Analisis harga dan permintaan pasar global.", heroImage: "/images/knowledge/knowledge-trend1.webp", heroImageAlt: "Anthurium dark hybrid", author: "Tim Riset BMJ", category: "Tren · Market Report", readTime: "5 min read", zone: "tren", sortOrder: 1 },
        { slug: "dormansi-alocasia", title: "Manajemen Dormansi Alocasia", subtitle: "Strategi pencahayaan buatan dan pengaturan suhu.", heroImage: "/images/knowledge/knowledge-trend2.webp", heroImageAlt: "Alocasia dormancy", author: "Tim Ahli BMJ", category: "Tren · Tips", readTime: "4 min read", zone: "tren", sortOrder: 2 },
        { slug: "gloriosum-vs-melanochrysum", title: "Philodendron Gloriosum vs Melanochrysum", subtitle: "Perbandingan mendalam dua spesies Philodendron paling populer.", heroImage: "/images/knowledge/knowledge-trend3.webp", heroImageAlt: "Philodendron Gloriosum", author: "Dr. Hartono S.", category: "Tren · Research", readTime: "7 min read", zone: "tren", sortOrder: 3 },
        { slug: "sertifikasi-cites-ekspor", title: "Sertifikasi CITES untuk Ekspor Tanaman", subtitle: "Panduan lengkap regulasi ekspor tanaman langka Indonesia.", heroImage: "/images/knowledge/knowledge-trend4.webp", heroImageAlt: "CITES documentation", author: "Tim Legal BMJ", category: "Tren · Industry", readTime: "6 min read", zone: "tren", sortOrder: 4 },
    ];

    const articleIds: Record<string, string> = {};
    for (const a of articleData) {
        const ac = articleContent[a.slug];
        const article = await prisma.article.upsert({
            where: { slug: a.slug },
            update: {},
            create: {
                slug: a.slug,
                title: a.title,
                subtitle: a.subtitle,
                content: ac?.content ?? "<p>Content coming soon.</p>",
                category: a.category,
                author: a.author,
                heroImage: a.heroImage,
                heroImageAlt: a.heroImageAlt,
                mobileSpecimenImage: a.heroImage,
                mobileSpecimenLabel: a.title,
                readTime: a.readTime,
                specs: ac?.specs ?? [],
                isPublished: true,
                isFeatured: a.slug === "panduan-identifikasi-hybrid-philodendron",
                zone: a.zone,
                sortOrder: a.sortOrder,
                authorProfileId: hartonoProfile.id,
            },
        });
        articleIds[a.slug] = article.id;
    }
    console.log(`  ✅ Articles: ${articleData.length}`);

    // ════════════════════════════════════════════════════════════
    // 10. ARTICLE RELATIONS (related articles cross-links)
    // ════════════════════════════════════════════════════════════
    const relations = [
        ["panduan-identifikasi-hybrid-philodendron", "taksonomi-araceae"],
        ["panduan-identifikasi-hybrid-philodendron", "inspeksi-kesehatan-tanaman"],
        ["panduan-identifikasi-hybrid-philodendron", "variegasi-monstera"],
        ["taksonomi-araceae", "variegasi-monstera"],
        ["taksonomi-araceae", "cutting-vs-tanaman-utuh"],
        ["inspeksi-kesehatan-tanaman", "interior-tanaman-ruang-gelap"],
        ["variegasi-monstera", "cutting-vs-tanaman-utuh"],
        ["interior-tanaman-ruang-gelap", "tropical-garden-modern"],
        ["anthurium-hybrid-market-2024", "taksonomi-araceae"],
        ["anthurium-hybrid-market-2024", "inspeksi-kesehatan-tanaman"],
        ["dormansi-alocasia", "variegasi-monstera"],
        ["dormansi-alocasia", "cutting-vs-tanaman-utuh"],
        ["gloriosum-vs-melanochrysum", "panduan-identifikasi-hybrid-philodendron"],
        ["gloriosum-vs-melanochrysum", "taksonomi-araceae"],
        ["gloriosum-vs-melanochrysum", "variegasi-monstera"],
        ["sertifikasi-cites-ekspor", "anthurium-hybrid-market-2024"],
        ["sertifikasi-cites-ekspor", "taksonomi-araceae"],
        ["sertifikasi-cites-ekspor", "inspeksi-kesehatan-tanaman"],
    ];

    for (const [from, to] of relations) {
        if (articleIds[from] && articleIds[to]) {
            await prisma.articleRelation.create({
                data: {
                    articleId: articleIds[from],
                    relatedArticleId: articleIds[to],
                },
            }).catch(() => {}); // Ignore duplicates on re-run
        }
    }
    console.log(`  ✅ Article Relations: ${relations.length}`);

    // ════════════════════════════════════════════════════════════
    // 11. PORTFOLIOS (from mock-portfolio-detail.ts)
    // ════════════════════════════════════════════════════════════
    const portfolios = [
        {
            slug: "project-1",
            title: "Proyek Lanskap Hotel Resort Bali",
            category: "Lanskap",
            heroImage: "/images/portfolio/portfolio-project-1.webp",
            description: "Proyek lanskap komprehensif untuk hotel resort bintang 5 di Bali dengan konsep tropical paradise.",
            challenge: "Klien membutuhkan 15.000+ tanaman dengan variasi tinggi dalam waktu 6 minggu untuk opening ceremony.",
            solution: "BMJ mengkoordinasikan 25 petani mitra untuk memenuhi kebutuhan volume besar.",
            result: "Proyek selesai tepat waktu dengan tingkat survival rate tanaman 98%.",
            specs: { client: "PT Hotel Paradise Indonesia", location: "Nusa Dua, Bali", scale: "15.000+ tanaman", duration: "6 minggu", completedAt: "Desember 2024", plantCount: "50+ varietas" },
            tags: ["Hotel", "Resort", "Tropical", "Large Scale", "Bali"],
            images: [
                { url: "/images/portfolio/portfolio-project-1.webp", alt: "Area lobby hotel dengan tanaman tropis" },
                { url: "/images/pages/overview-gallery-proyek-1.webp", alt: "Pool area dengan palm" },
                { url: "/images/pages/overview-gallery-proyek-2.webp", alt: "Vertical garden" },
                { url: "/images/pages/overview-gallery-kebun-1.webp", alt: "Proses seleksi tanaman" },
            ],
        },
        {
            slug: "project-2",
            title: "Koleksi Monstera & Philodendron Langka",
            category: "Eksotik",
            heroImage: "/images/portfolio/portfolio-project-2.webp",
            description: "Kurasi dan supply koleksi tanaman aroid langka untuk kolektor premium di Jakarta.",
            challenge: "Mencari specimen berkualitas tinggi dengan variegasi konsisten untuk kolektor demanding.",
            solution: "Koordinasi dengan petani spesialis aroid di jaringan BMJ.",
            result: "Berhasil supply 200+ specimen rare dengan tingkat kepuasan 100%.",
            specs: { client: "Kolektor Privat", location: "Jakarta Selatan", scale: "200+ specimen", duration: "3 bulan", completedAt: "November 2024", plantCount: "25 varietas rare" },
            tags: ["Monstera", "Philodendron", "Rare", "Collector", "Aroid"],
            images: [
                { url: "/images/portfolio/portfolio-project-2.webp", alt: "Koleksi Monstera Thai Constellation" },
                { url: "/images/pages/overview-gallery-kebun-1.webp", alt: "Greenhouse koleksi aroid" },
                { url: "/images/pages/overview-gallery-kebun-2.webp", alt: "Area propagasi tanaman rare" },
            ],
        },
        {
            slug: "project-3",
            title: "Dokumentasi Pengiriman: Cipanas → Surabaya",
            category: "Logistik",
            heroImage: "/images/portfolio/delivery-loading.webp",
            description: "Dokumentasi lengkap proses pengiriman 500 tanaman hias dari nursery mitra di Cipanas ke distributor tanaman di Surabaya.",
            challenge: "Memastikan 500 tanaman tetap dalam kondisi prima dalam perjalanan 16 jam via jalur darat.",
            solution: "Penerapan SOP packaging khusus tanaman hidup.",
            result: "500 tanaman tiba dengan survival rate 100%.",
            specs: { client: "CV Hijau Nusantara", location: "Cipanas → Surabaya", scale: "500 tanaman", duration: "3 hari", completedAt: "Januari 2025", plantCount: "12 varietas hias" },
            tags: ["Logistik", "Pengiriman", "Darat", "SOP", "Cipanas", "Surabaya"],
            images: [
                { url: "/images/portfolio/delivery-kebun-seleksi.webp", alt: "Seleksi tanaman di kebun" },
                { url: "/images/portfolio/delivery-proses-akar.webp", alt: "Pengolahan akar" },
                { url: "/images/portfolio/delivery-packing.webp", alt: "Proses packing tanaman" },
                { url: "/images/portfolio/delivery-loading.webp", alt: "Loading ke armada" },
                { url: "/images/portfolio/delivery-transit.webp", alt: "Perjalanan transit darat" },
                { url: "/images/portfolio/delivery-serah-terima.webp", alt: "Serah terima" },
            ],
            deliveryStages: [
                { step: "01", label: "Seleksi di Kebun", icon: "yard", description: "Tim QC turun langsung ke kebun mitra di Cipanas.", images: [{ id: "s1a", src: "/images/portfolio/delivery-kebun-seleksi.webp", alt: "Proses seleksi tanaman" }] },
                { step: "02", label: "Pengolahan & Persiapan", icon: "compost", description: "Tanaman melalui proses pembersihan akar dan treatment.", images: [{ id: "s2a", src: "/images/portfolio/delivery-proses-akar.webp", alt: "Pembersihan akar" }] },
                { step: "03", label: "Packing Profesional", icon: "inventory_2", description: "Setiap tanaman dibungkus secara individual.", images: [{ id: "s3a", src: "/images/portfolio/delivery-packing.webp", alt: "Proses packing" }] },
                { step: "04", label: "Loading & Pengiriman", icon: "local_shipping", description: "Kotak-kotak diload ke armada pengiriman.", images: [{ id: "s4a", src: "/images/portfolio/delivery-loading.webp", alt: "Loading armada" }, { id: "s4b", src: "/images/portfolio/delivery-transit.webp", alt: "Transit" }] },
                { step: "05", label: "Serah Terima", icon: "handshake", description: "Pengecekan kondisi bersama kurir.", images: [{ id: "s5a", src: "/images/portfolio/delivery-serah-terima.webp", alt: "Serah terima" }] },
            ],
        },
    ];

    for (const pf of portfolios) {
        await prisma.portfolio.upsert({
            where: { slug: pf.slug },
            update: {},
            create: {
                slug: pf.slug,
                title: pf.title,
                category: pf.category,
                heroImage: pf.heroImage,
                description: pf.description,
                challenge: pf.challenge,
                solution: pf.solution,
                result: pf.result,
                specs: pf.specs,
                tags: pf.tags,
                images: {
                    create: pf.images.map((img, i) => ({
                        url: img.url,
                        alt: img.alt,
                        sortOrder: i,
                    })),
                },
                deliveryStages: pf.deliveryStages ? {
                    create: pf.deliveryStages.map((ds, i) => ({
                        step: ds.step,
                        label: ds.label,
                        description: ds.description,
                        icon: ds.icon,
                        images: ds.images,
                        sortOrder: i,
                    })),
                } : undefined,
            },
        });
    }
    console.log(`  ✅ Portfolios: ${portfolios.length} (with images + delivery stages)`);

    // ════════════════════════════════════════════════════════════
    // 12. PAGE CONTENTS (CMS JSON blobs for 6 pages)
    // ════════════════════════════════════════════════════════════
    // For CMS pages (homepage, navbar, layanan, overview, knowledge-page, portfolio-page),
    // we store the full mock data as JSON so components can consume it unchanged.
    // This avoids breaking any UI during migration.

    const pageKeys = ["homepage", "navbar", "layanan", "overview", "knowledge-page", "portfolio-page"];

    for (const key of pageKeys) {
        const content = pageContentData[key];
        if (!content) continue;
        await prisma.pageContent.upsert({
            where: { key },
            update: { content },
            create: { key, content },
        });
    }
    console.log(`  ✅ Page Contents: ${pageKeys.length} (real CMS data)`);

    // ════════════════════════════════════════════════════════════
    // SUMMARY
    // ════════════════════════════════════════════════════════════
    console.log("\n🎉 Seeding complete!\n");
    console.log("  Tables seeded:");
    console.log("    - Users: 3");
    console.log(`    - Categories: ${categoryData.length}`);
    console.log(`    - Products: ${plants.length} (with images)`);
    console.log(`    - Reviews: ${reviewData.length}`);
    console.log(`    - Addresses: ${addresses.length}`);
    console.log(`    - Coupons: ${coupons.length}`);
    console.log(`    - Orders: ${orders.length} (with items + timeline)`);
    console.log(`    - Roles: ${roleData.length}`);
    console.log(`    - Staff Users + Profiles: 1`);
    console.log(`    - Articles: ${articleData.length} (with relations)`);
    console.log(`    - Portfolios: ${portfolios.length} (with images + stages)`);
    console.log(`    - Page Contents: ${pageKeys.length}`);
}

main()
    .catch((e) => {
        console.error("❌ Seed failed:", e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
