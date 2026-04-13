// Server Component — direct form import + SEO metadata
import type { Metadata } from "next";
import ForgotPasswordForm from "@/shared/components/auth/ForgotPasswordForm";

export const metadata: Metadata = {
    title: "Lupa Password",
    description: "Reset password akun BMJ Plant Store Anda.",
};

export default function ForgotPasswordPage() {
    return (
        <div className="container-page py-12 md:py-20 flex items-center justify-center min-h-[70vh]">
            <ForgotPasswordForm />
        </div>
    );
}
