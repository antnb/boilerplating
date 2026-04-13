import 'server-only';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import sharp from 'sharp';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export type UploadBucket = 'products' | 'payment-proofs' | 'articles' | 'pages' | 'review-photos';

// ═══════════════════════════════════════════
// Magic Bytes — verify ACTUAL file type, not HTTP header
// ═══════════════════════════════════════════

const MAGIC_SIGNATURES: Record<string, number[][]> = {
  'image/jpeg': [[0xFF, 0xD8, 0xFF]],
  'image/png':  [[0x89, 0x50, 0x4E, 0x47]],
  'image/webp': [[0x52, 0x49, 0x46, 0x46]], // RIFF header
};

/** Verify file's actual type by reading magic bytes (first 16 bytes) */
function verifyMagicBytes(buffer: Buffer): string | null {
  for (const [mimeType, signatures] of Object.entries(MAGIC_SIGNATURES)) {
    for (const sig of signatures) {
      if (sig.every((byte, i) => buffer[i] === byte)) {
        return mimeType;
      }
    }
  }
  return null; // Unknown — reject
}

// ═══════════════════════════════════════════
// Image Processing via Sharp — defense-in-depth
// ═══════════════════════════════════════════

interface ProcessedImage {
  buffer: Buffer;
  ext: string;
  mimeType: string;
}

/**
 * Re-encode image through Sharp.
 * - Strips ALL metadata (EXIF, embedded scripts, polyglot payloads)
 * - Resizes to max dimension (preserves aspect ratio)
 * - Outputs WebP (fallback: JPEG if Sharp WebP fails)
 */
async function processImage(
  inputBuffer: Buffer,
  options?: { maxDimension?: number }
): Promise<ProcessedImage> {
  const maxDim = options?.maxDimension ?? 1600;

  try {
    // Primary: WebP output
    const processed = await sharp(inputBuffer)
      .rotate() // Auto-rotate based on EXIF before stripping
      .resize(maxDim, maxDim, { fit: 'inside', withoutEnlargement: true })
      .removeAlpha() // Remove alpha for photo content (avoid transparency in reviews)
      .webp({ quality: 82, effort: 4 })
      .toBuffer();

    return { buffer: processed, ext: 'webp', mimeType: 'image/webp' };
  } catch {
    // Fallback: JPEG output (if WebP encoding fails for edge-case inputs)
    const fallback = await sharp(inputBuffer)
      .rotate()
      .resize(maxDim, maxDim, { fit: 'inside', withoutEnlargement: true })
      .flatten({ background: { r: 255, g: 255, b: 255 } }) // White BG for transparency
      .jpeg({ quality: 85, mozjpeg: true })
      .toBuffer();

    return { buffer: fallback, ext: 'jpg', mimeType: 'image/jpeg' };
  }
}

// ═══════════════════════════════════════════
// Main Upload Function
// ═══════════════════════════════════════════

/**
 * Save an uploaded file with defense-in-depth security:
 * 1. Size limit check
 * 2. Magic bytes verification (actual file type)
 * 3. Sharp re-encoding (strips payloads + normalizes format)
 * 4. Random filename (no user-controlled names)
 *
 * @throws Error if file fails any security check
 */
export async function saveUploadedFile(
  file: File,
  bucket: UploadBucket,
  options?: { maxDimension?: number }
): Promise<{ url: string; filename: string }> {
  // ── Layer 1: Size limit ──
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('Ukuran file maksimal 5MB.');
  }

  // ── Layer 2: Read raw buffer ──
  const rawBuffer = Buffer.from(await file.arrayBuffer());

  // ── Layer 3: Magic bytes verification ──
  const actualType = verifyMagicBytes(rawBuffer);
  if (!actualType) {
    throw new Error('Tipe file tidak diizinkan. Hanya JPG, PNG, atau WebP.');
  }

  // ── Layer 4: Sharp re-encoding (strips ALL embedded content) ──
  const processed = await processImage(rawBuffer, options);

  // ── Layer 5: Generate random filename ──
  const uniqueName = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}.${processed.ext}`;

  // ── Layer 6: Ensure directory & write ──
  const dir = path.join(UPLOAD_DIR, bucket);
  await mkdir(dir, { recursive: true });
  const filepath = path.join(dir, uniqueName);
  await writeFile(filepath, processed.buffer);

  return {
    url: `/uploads/${bucket}/${uniqueName}`,
    filename: uniqueName,
  };
}
