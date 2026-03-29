import 'server-only';
import { resend, EMAIL_FROM } from './client';
import { PasswordResetEmail } from './templates/password-reset';
import { OrderConfirmationEmail } from './templates/order-confirmation';

/**
 * Send password reset email.
 * Returns true if email was sent successfully, false otherwise.
 * NEVER throws — callers must handle boolean result.
 */
export async function sendPasswordResetEmail(params: {
    to: string;
    resetUrl: string;
    userName?: string;
}): Promise<boolean> {
    try {
        const { error } = await resend.emails.send({
            from: EMAIL_FROM,
            to: params.to,
            subject: 'Reset Password — BMJ Plant Store',
            react: PasswordResetEmail({
                resetUrl: params.resetUrl,
                userName: params.userName,
            }),
        });

        if (error) {
            console.error('[email] Failed to send password reset email:', error.message);
            return false;
        }

        return true;
    } catch (err) {
        console.error('[email] Unexpected error sending password reset email:', err);
        return false;
    }
}

/**
 * Send order confirmation email.
 * Returns true if email was sent successfully, false otherwise.
 * NEVER throws — callers must handle boolean result.
 * This is fire-and-forget: email failure should NOT block order creation.
 */
export async function sendOrderConfirmationEmail(params: {
    to: string;
    customerName: string;
    orderNumber: string;
    items: Array<{
        productName: string;
        quantity: number;
        unitPrice: number;
        image?: string | null;
    }>;
    subtotal: number;
    shippingCost: number;
    discount: number;
    total: number;
    paymentMethod: string;
}): Promise<boolean> {
    try {
        const { error } = await resend.emails.send({
            from: EMAIL_FROM,
            to: params.to,
            subject: `Pesanan #${params.orderNumber} Dikonfirmasi — BMJ Plant Store`,
            react: OrderConfirmationEmail({
                orderNumber: params.orderNumber,
                customerName: params.customerName,
                items: params.items,
                subtotal: params.subtotal,
                shippingCost: params.shippingCost,
                discount: params.discount,
                total: params.total,
                paymentMethod: params.paymentMethod,
            }),
        });

        if (error) {
            console.error('[email] Failed to send order confirmation email:', error.message);
            return false;
        }

        return true;
    } catch (err) {
        console.error('[email] Unexpected error sending order confirmation email:', err);
        return false;
    }
}
