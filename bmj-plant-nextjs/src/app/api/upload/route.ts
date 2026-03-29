import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth-helpers';
import { ROLE_IDS } from '@/lib/constants/roles';
import { saveUploadedFile, type UploadBucket } from '@/lib/storage/upload';
import { hasUserPurchasedProduct } from '@/lib/data/orders';

const VALID_BUCKETS: UploadBucket[] = ['products', 'payment-proofs', 'articles', 'pages', 'review-photos'];

/** Buckets that require admin role */
const ADMIN_ONLY_BUCKETS: UploadBucket[] = ['products', 'articles', 'pages'];

/** Bucket-specific Sharp processing options */
const BUCKET_OPTIONS: Partial<Record<UploadBucket, { maxDimension: number }>> = {
    'review-photos': { maxDimension: 1200 },  // Smaller for review photos
    'products': { maxDimension: 1600 },        // Larger for product gallery
};

export async function POST(request: NextRequest) {
    try {
        // ── Auth check ──
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json(
                { success: false, error: 'Anda harus login terlebih dahulu' },
                { status: 401 }
            );
        }

        // ── Parse FormData ──
        const formData = await request.formData();
        const file = formData.get('file') as File | null;
        const bucket = formData.get('bucket') as string | null;
        const productId = formData.get('productId') as string | null;

        if (!file || !(file instanceof File)) {
            return NextResponse.json(
                { success: false, error: 'File wajib diupload' },
                { status: 400 }
            );
        }

        if (!bucket || !VALID_BUCKETS.includes(bucket as UploadBucket)) {
            return NextResponse.json(
                { success: false, error: 'Bucket tidak valid' },
                { status: 400 }
            );
        }

        const typedBucket = bucket as UploadBucket;

        // ── Role-based access: admin-only buckets ──
        if (ADMIN_ONLY_BUCKETS.includes(typedBucket) && user.roleId !== ROLE_IDS.ADMIN) {
            return NextResponse.json(
                { success: false, error: 'Anda tidak memiliki akses untuk upload ini' },
                { status: 403 }
            );
        }

        // ── Purchase verification for review-photos bucket ──
        if (typedBucket === 'review-photos') {
            if (!productId) {
                return NextResponse.json(
                    { success: false, error: 'productId wajib untuk upload foto review' },
                    { status: 400 }
                );
            }
            const purchased = await hasUserPurchasedProduct(user.id, productId);
            if (!purchased) {
                return NextResponse.json(
                    { success: false, error: 'Anda hanya bisa upload foto untuk produk yang sudah dibeli' },
                    { status: 403 }
                );
            }
        }

        // ── Save file with bucket-specific options ──
        const options = BUCKET_OPTIONS[typedBucket];
        const result = await saveUploadedFile(file, typedBucket, options);

        return NextResponse.json({
            success: true,
            url: result.url,
            filename: result.filename,
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Upload gagal';
        return NextResponse.json(
            { success: false, error: message },
            { status: 400 }
        );
    }
}
