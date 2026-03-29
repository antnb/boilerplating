"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Loader2, Mail, Lock, User, Phone } from "lucide-react";
import { toast } from "sonner";
import { registerCustomer } from "@/lib/actions/customer-actions";

export function RegisterForm() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const result = await registerCustomer({ email, password, name, phone });
        if (result.error) { toast.error(result.error); setIsLoading(false); return; }
        const signInResult = await signIn("credentials", { email, password, redirect: false });
        setIsLoading(false);
        if (signInResult?.error) {
            toast.error("Registrasi berhasil, silakan login manual");
            router.push("/login");
        } else {
            toast.success("Akun berhasil dibuat!");
            router.push("/account");
        }
    };

    return (
        <Card className="p-8 max-w-md w-full mx-auto">
            <h1 className="font-serif text-2xl font-bold text-center mb-6">Daftar Akun</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Nama Lengkap</Label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input id="name" placeholder="Nama lengkap" value={name} onChange={(e) => setName(e.target.value)} className="pl-10" required />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="reg-email">Email</Label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input id="reg-email" type="email" placeholder="email@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" required />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="phone">Telepon (opsional)</Label>
                    <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input id="phone" type="tel" placeholder="08xxxxxxxxxx" value={phone} onChange={(e) => setPhone(e.target.value)} className="pl-10" />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="reg-password">Password</Label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input id="reg-password" type="password" placeholder="Minimal 8 karakter" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10" minLength={8} required />
                    </div>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Buat Akun
                </Button>
            </form>
            <p className="text-sm text-center text-muted-foreground mt-4">
                Sudah punya akun?{" "}
                <Link href="/login" className="text-primary hover:underline">Login</Link>
            </p>
        </Card>
    );
}
