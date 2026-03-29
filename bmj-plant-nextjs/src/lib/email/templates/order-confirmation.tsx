import * as React from 'react';

interface OrderItem {
    productName: string;
    quantity: number;
    unitPrice: number;
    image?: string | null;
}

interface OrderConfirmationEmailProps {
    orderNumber: string;
    customerName: string;
    items: OrderItem[];
    subtotal: number;
    shippingCost: number;
    discount: number;
    total: number;
    paymentMethod: string;
}

function formatRupiah(amount: number): string {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
}

export function OrderConfirmationEmail({
    orderNumber,
    customerName,
    items,
    subtotal,
    shippingCost,
    discount,
    total,
    paymentMethod,
}: OrderConfirmationEmailProps) {
    return (
        <div style={{
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            maxWidth: '560px',
            margin: '0 auto',
            padding: '40px 20px',
            backgroundColor: '#f8faf8',
        }}>
            {/* Header */}
            <div style={{
                textAlign: 'center' as const,
                marginBottom: '32px',
            }}>
                <div style={{
                    display: 'inline-block',
                    backgroundColor: '#1a3a2a',
                    color: '#ffffff',
                    padding: '12px 24px',
                    borderRadius: '12px',
                    fontSize: '18px',
                    fontWeight: 700,
                    letterSpacing: '0.05em',
                }}>
                    🌿 BMJ Plant Store
                </div>
            </div>

            {/* Card */}
            <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                padding: '32px',
                border: '1px solid #e5ebe5',
            }}>
                {/* Success icon */}
                <div style={{ textAlign: 'center' as const, marginBottom: '16px' }}>
                    <div style={{
                        display: 'inline-block',
                        backgroundColor: '#e8f5e9',
                        borderRadius: '50%',
                        width: '56px',
                        height: '56px',
                        lineHeight: '56px',
                        fontSize: '28px',
                        textAlign: 'center' as const,
                    }}>
                        ✓
                    </div>
                </div>

                <h1 style={{
                    fontSize: '20px',
                    fontWeight: 700,
                    color: '#1a3a2a',
                    marginTop: 0,
                    marginBottom: '8px',
                    textAlign: 'center' as const,
                }}>
                    Pesanan Dikonfirmasi!
                </h1>

                <p style={{
                    fontSize: '13px',
                    color: '#8a9a8a',
                    textAlign: 'center' as const,
                    marginBottom: '24px',
                }}>
                    No. Pesanan: <strong style={{ color: '#1a3a2a' }}>{orderNumber}</strong>
                </p>

                <p style={{
                    fontSize: '14px',
                    color: '#4a5a4a',
                    lineHeight: '1.6',
                    marginBottom: '24px',
                }}>
                    Halo {customerName}, terima kasih atas pesanan Anda!
                    Berikut ringkasan pesanan:
                </p>

                {/* Items */}
                <div style={{
                    borderTop: '1px solid #e5ebe5',
                    borderBottom: '1px solid #e5ebe5',
                    padding: '16px 0',
                    marginBottom: '16px',
                }}>
                    {items.map((item, idx) => (
                        <div key={idx} style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            padding: '8px 0',
                            fontSize: '13px',
                        }}>
                            <span style={{ color: '#4a5a4a' }}>
                                {item.productName} × {item.quantity}
                            </span>
                            <span style={{ color: '#1a3a2a', fontWeight: 600 }}>
                                {formatRupiah(item.unitPrice * item.quantity)}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Totals */}
                <div style={{ fontSize: '13px', marginBottom: '24px' }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '4px 0',
                        color: '#8a9a8a',
                    }}>
                        <span>Subtotal</span>
                        <span>{formatRupiah(subtotal)}</span>
                    </div>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '4px 0',
                        color: '#8a9a8a',
                    }}>
                        <span>Ongkos Kirim</span>
                        <span>{formatRupiah(shippingCost)}</span>
                    </div>
                    {discount > 0 && (
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            padding: '4px 0',
                            color: '#4caf50',
                        }}>
                            <span>Diskon</span>
                            <span>-{formatRupiah(discount)}</span>
                        </div>
                    )}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '12px 0 4px',
                        borderTop: '1px solid #e5ebe5',
                        marginTop: '8px',
                        fontSize: '16px',
                        fontWeight: 700,
                        color: '#1a3a2a',
                    }}>
                        <span>Total</span>
                        <span>{formatRupiah(total)}</span>
                    </div>
                </div>

                {/* Payment method */}
                <div style={{
                    backgroundColor: '#f4f7f4',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    fontSize: '13px',
                    color: '#4a5a4a',
                }}>
                    <strong>Metode Pembayaran:</strong> {paymentMethod}
                </div>
            </div>

            {/* Footer */}
            <div style={{
                textAlign: 'center' as const,
                marginTop: '24px',
                fontSize: '11px',
                color: '#8a9a8a',
                lineHeight: '1.6',
            }}>
                <p style={{ margin: '0 0 4px 0' }}>
                    © {new Date().getFullYear()} BMJ Plant Store
                </p>
                <p style={{ margin: 0 }}>
                    Email ini dikirim secara otomatis. Mohon tidak membalas email ini.
                </p>
            </div>
        </div>
    );
}
