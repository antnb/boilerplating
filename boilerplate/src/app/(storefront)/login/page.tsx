// Server Component — redirect if already logged in + SEO metadata
import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/shared/lib/auth";
import { ROLE_IDS } from "@/shared/lib/constants/roles";
import { LoginForm } from "@/shared/components/auth/LoginForm";

export const metadata: Metadata = {
    title: "Masuk",
    description: "Masuk ke akun BMJ Plant Store Anda untuk melacak pesanan dan mengelola profil.",
};

export default async function LoginPage() {
    // Per Next.js best practice: redirect authenticated users away from login
    // Route based on role: staff → /manage, customer → /dashboard
    const session = await getServerSession(authOptions);
    if (session?.user) {
        const isStaff = session.user.roleId !== ROLE_IDS.CUSTOMER;
        redirect(isStaff ? "/manage" : "/dashboard");
    }

    return (
        <div className="container-page py-12 md:py-20 flex items-center justify-center min-h-[70vh]">
            <Suspense>
                <LoginForm />
            </Suspense>
        </div>
    );
}
