"use client";

import Link from "next/link";
import { requestPasswordReset } from "@/lib/actions/password-reset-actions";
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Leaf, Mail, AlertCircle, ArrowLeft, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';

const emailSchema = z.object({
    email: z.string().email('Email tidak valid'),
});

export default function ForgotPasswordForm() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        const result = emailSchema.safeParse({ email });
        if (!result.success) { setError(result.error.issues[0].message); return; }
        setIsLoading(true);
        const response = await requestPasswordReset(email);
        setIsLoading(false);
        if (!response.success && response.error) {
            setError(response.error);
            return;
        }
        setIsSuccess(true);
        toast.success('Jika email terdaftar, link reset password telah dikirim');
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/10 flex items-center justify-center p-4">
                <Card className="w-full max-w-md shadow-xl border-border/50">
                    <CardHeader className="text-center space-y-4">
                        <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-8 h-8 text-emerald-600" />
                        </div>
                        <CardTitle className="text-2xl font-serif text-foreground">Email Terkirim!</CardTitle>
                        <CardDescription className="text-muted-foreground">
                            Kami telah mengirim link reset password ke <strong>{email}</strong>. Silakan cek inbox email Anda.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground text-center">Tidak menerima email? Cek folder spam atau tunggu beberapa menit.</p>
                        <Button variant="outline" className="w-full" onClick={() => setIsSuccess(false)}>Kirim Ulang Email</Button>
                    </CardContent>
                    <CardFooter className="flex justify-center">
                        <Link href="/login" className="text-primary hover:underline flex items-center gap-2">
                            <ArrowLeft className="w-4 h-4" />
                            Kembali ke Login
                        </Link>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/10 flex items-center justify-center p-4">
            <Card className="w-full max-w-md shadow-xl border-border/50">
                <CardHeader className="text-center space-y-4">
                    <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                        <Leaf className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-serif text-foreground"><h1>Lupa Password?</h1></CardTitle>
                    <CardDescription className="text-muted-foreground">Masukkan email Anda dan kami akan mengirimkan link untuk reset password</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-foreground">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input id="email" type="email" placeholder="admin@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className={`pl-10 ${error ? 'border-destructive' : ''}`} disabled={isLoading} />
                            </div>
                            {error && (
                                <p className="text-sm text-destructive flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />{error}
                                </p>
                            )}
                        </div>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? 'Mengirim...' : 'Kirim Link Reset'}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Link href="/login" className="text-primary hover:underline flex items-center gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        Kembali ke Login
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}
