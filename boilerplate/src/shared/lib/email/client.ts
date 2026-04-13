import 'server-only';
import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
    console.warn('[email] RESEND_API_KEY not set — emails will not be sent');
}

export const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Default sender address — configured via EMAIL_FROM env var.
 * For testing: onboarding@resend.dev
 * For production: noreply@bmjplantstore.com (after domain verification)
 */
export const EMAIL_FROM = process.env.EMAIL_FROM || 'BMJ Plant Store <onboarding@resend.dev>';
