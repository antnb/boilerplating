"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Loader2, Mail, Lock } from "lucide-react";
import { toast } from "sonner";
import { ROLE_IDS } from "@/lib/constants/roles";

export function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const result = await signIn("credentials", { email, password, redirect: false });
        setIsLoading(false);
        if (result?.error) {
            toast.error(result.error);
        } else {
            toast.success("Login berhasil!");

            // Merge guest cart & wishlist into DB before redirect
            try {
                // Cart merge
                const cartRaw = localStorage.getItem("bmj-cart");
                if (cartRaw) {
                    const cartItems = JSON.parse(cartRaw) as Array<{ plantId: string; quantity: number }>;
                    if (cartItems.length > 0) {
                        const { mergeLocalCartToDb } = await import("@/lib/actions/cart-actions");
                        await mergeLocalCartToDb(
                            cartItems.map((i) => ({ productId: i.plantId, quantity: i.quantity }))
                        );
                        localStorage.removeItem("bmj-cart");
                        window.dispatchEvent(new Event("cart-change"));
                    }
                }

                // Wishlist merge
                const wishlistRaw = localStorage.getItem("bmj-wishlist");
                if (wishlistRaw) {
                    const wishlistIds = JSON.parse(wishlistRaw) as string[];
                    if (wishlistIds.length > 0) {
                        const { mergeLocalWishlistToDb } = await import("@/lib/actions/wishlist-actions");
                        await mergeLocalWishlistToDb(wishlistIds);
                        localStorage.removeItem("bmj-wishlist");
                        window.dispatchEvent(new Event("wishlist-change"));
                    }
                }
            } catch (e) {
                console.error("Cart/wishlist merge error:", e);
                // Non-blocking — don't prevent login redirect
            }

            // Determine redirect target:
            // 1. If callbackUrl from middleware (e.g. ?callbackUrl=/manage), use it
            // 2. Otherwise, redirect based on role: staff → /manage, customer → /dashboard
            const callbackUrl = searchParams?.get("callbackUrl");
            if (callbackUrl) {
                router.push(callbackUrl);
            } else {
                // Fetch fresh session to get role info
                const freshSession = await getSession();
                const isStaff = freshSession?.user?.roleId !== ROLE_IDS.CUSTOMER;
                router.push(isStaff ? "/manage" : "/dashboard");
            }
        }
    };

    return (
        <Card className="p-8 max-w-md w-full mx-auto">
            <h1 className="font-serif text-2xl font-bold text-center mb-6">Login</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            id="email"
                            type="email"
                            placeholder="nama@email.com"
                            className="pl-10"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            className="pl-10"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Memproses...
                        </>
                    ) : (
                        "Masuk"
                    )}
                </Button>
            </form>
            <div className="mt-4 text-center text-sm text-muted-foreground space-y-2">
                <p>
                    <Link href="/forgot-password" className="text-primary hover:underline">Lupa password?</Link>
                </p>
                <p>
                    Belum punya akun?{" "}
                    <Link href="/register" className="text-primary hover:underline">Daftar</Link>
                </p>
            </div>
        </Card>
    );
}
