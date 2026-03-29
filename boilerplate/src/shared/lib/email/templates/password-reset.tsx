import * as React from 'react';

interface PasswordResetEmailProps {
    resetUrl: string;
    userName?: string;
}

export function PasswordResetEmail({ resetUrl, userName }: PasswordResetEmailProps) {
    const greeting = userName ? `Halo ${userName},` : 'Halo,';

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
                <h1 style={{
                    fontSize: '20px',
                    fontWeight: 700,
                    color: '#1a3a2a',
                    marginTop: 0,
                    marginBottom: '16px',
                }}>
                    Reset Password
                </h1>

                <p style={{
                    fontSize: '14px',
                    color: '#4a5a4a',
                    lineHeight: '1.6',
                    marginBottom: '8px',
                }}>
                    {greeting}
                </p>

                <p style={{
                    fontSize: '14px',
                    color: '#4a5a4a',
                    lineHeight: '1.6',
                    marginBottom: '24px',
                }}>
                    Kami menerima permintaan untuk mereset password akun Anda.
                    Klik tombol di bawah untuk membuat password baru:
                </p>

                {/* CTA Button */}
                <div style={{ textAlign: 'center' as const, marginBottom: '24px' }}>
                    <a
                        href={resetUrl}
                        style={{
                            display: 'inline-block',
                            backgroundColor: '#1a3a2a',
                            color: '#ffffff',
                            padding: '14px 32px',
                            borderRadius: '10px',
                            fontSize: '14px',
                            fontWeight: 600,
                            textDecoration: 'none',
                        }}
                    >
                        Reset Password Saya
                    </a>
                </div>

                <p style={{
                    fontSize: '12px',
                    color: '#8a9a8a',
                    lineHeight: '1.6',
                    marginBottom: '16px',
                }}>
                    Link ini akan kadaluarsa dalam 1 jam. Jika Anda tidak merasa
                    meminta reset password, abaikan email ini — akun Anda tetap aman.
                </p>

                {/* Fallback URL */}
                <div style={{
                    backgroundColor: '#f4f7f4',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    marginBottom: '0',
                }}>
                    <p style={{
                        fontSize: '11px',
                        color: '#8a9a8a',
                        margin: '0 0 4px 0',
                    }}>
                        Jika tombol tidak berfungsi, salin link berikut:
                    </p>
                    <p style={{
                        fontSize: '11px',
                        color: '#1a3a2a',
                        wordBreak: 'break-all' as const,
                        margin: 0,
                    }}>
                        {resetUrl}
                    </p>
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
