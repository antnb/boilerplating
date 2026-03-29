// Server Component — redirect if already logged in + SEO metadata
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ROLE_IDS } from "@/lib/constants/roles";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
    title: "Daftar Akun Baru",
    description: "Buat akun BMJ Plant Store untuk mulai berbelanja tanaman hias premium.",
};

export default async function RegisterPage() {
    // Per Next.js best practice: redirect authenticated users away from register
    // Route based on role: staff → /manage, customer → /dashboard
    const session = await getServerSession(authOptions);
    if (session?.user) {
        const isStaff = session.user.roleId !== ROLE_IDS.CUSTOMER;
        redirect(isStaff ? "/manage" : "/dashboard");
    }

    return (
        <div className="container-page py-12 md:py-20 flex items-center justify-center min-h-[70vh]">
            <RegisterForm />
        </div>
    );
}
