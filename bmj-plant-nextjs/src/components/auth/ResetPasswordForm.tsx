"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Leaf, Lock, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { resetPasswordWithToken } from "@/lib/actions/password-reset-actions";

const passwordSchema = z
    .object({
        password: z.string().min(8, "Password minimal 8 karakter").max(72),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Password tidak cocok",
        path: ["confirmPassword"],
    });

type Props = {
    token: string;
};

export default function ResetPasswordForm({ token }: Props) {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [errors, setErrors] = useState<{
        password?: string;
        confirmPassword?: string;
        general?: string;
    }>({});
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        const result = passwordSchema.safeParse({ password, confirmPassword });
        if (!result.success) {
            const fieldErrors: typeof errors = {};
            result.error.issues.forEach((err) => {
                if (err.path[0] === "password") fieldErrors.password = err.message;
                if (err.path[0] === "confirmPassword")
                    fieldErrors.confirmPassword = err.message;
            });
            setErrors(fieldErrors);
            return;
        }

        setIsLoading(true);

        const response = await resetPasswordWithToken({
            token,
            password: result.data.password,
        });

        setIsLoading(false);

        if (!response.success) {
            if (
                response.error?.includes("kadaluarsa") ||
                response.error?.includes("tidak valid") ||
                response.error?.includes("digunakan")
            ) {
                setErrors({ general: response.error });
            } else {
                toast.error(response.error || "Gagal mereset password");
            }
            return;
        }

        setIsSuccess(true);
        toast.success("Password berhasil diubah!");

        // Redirect to login after 3 seconds
        setTimeout(() => {
            router.push("/login");
        }, 3000);
    };

    if (isSuccess) {
        return (
            <Card className="w-full max-w-md shadow-xl border-border/50">
                <CardHeader className="text-center space-y-4">
                    <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <CardTitle className="text-2xl font-serif text-foreground">
                        Password Diubah!
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                        Password Anda berhasil diubah. Anda akan dialihkan ke halaman
                        login...
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button className="w-full" onClick={() => router.push("/login")}>
                        Ke Halaman Login
                    </Button>
                </CardContent>
            </Card>
        );
    }

    if (errors.general) {
        return (
            <Card className="w-full max-w-md shadow-xl border-border/50">
                <CardHeader className="text-center space-y-4">
                    <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
                        <AlertCircle className="w-8 h-8 text-destructive" />
                    </div>
                    <CardTitle className="text-2xl font-serif text-foreground">
                        Link Tidak Valid
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                        {errors.general}. Silakan minta link baru.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button
                        className="w-full"
                        onClick={() => router.push("/forgot-password")}
                    >
                        Minta Link Baru
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full max-w-md shadow-xl border-border/50">
            <CardHeader className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <Leaf className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-2xl font-serif text-foreground">
                    <h1>Reset Password</h1>
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                    Masukkan password baru untuk akun Anda
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-foreground">
                            Password Baru
                        </Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={`pl-10 ${errors.password ? "border-destructive" : ""}`}
                                disabled={isLoading}
                            />
                        </div>
                        {errors.password && (
                            <p className="text-sm text-destructive flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                {errors.password}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="text-foreground">
                            Konfirmasi Password
                        </Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className={`pl-10 ${errors.confirmPassword ? "border-destructive" : ""}`}
                                disabled={isLoading}
                            />
                        </div>
                        {errors.confirmPassword && (
                            <p className="text-sm text-destructive flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                {errors.confirmPassword}
                            </p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Menyimpan...
                            </>
                        ) : (
                            "Simpan Password Baru"
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
