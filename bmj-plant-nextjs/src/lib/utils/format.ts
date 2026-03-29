/**
 * Format a number as Indonesian Rupiah (without currency prefix).
 * Example: 1250000 → "1.250.000"
 */
export function formatPrice(price: number): string {
    return new Intl.NumberFormat("id-ID").format(price);
}

/**
 * Format a number as Indonesian Rupiah with Rp prefix.
 * Example: 1250000 → "Rp 1.250.000"
 */
export function formatRupiah(price: number): string {
    return `Rp ${new Intl.NumberFormat("id-ID").format(price)}`;
}
