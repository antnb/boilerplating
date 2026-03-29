// Server Component — validates token existence, passes to client form
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

export const metadata: Metadata = {
    title: "Reset Password",
    description: "Buat password baru untuk akun BMJ Plant Store Anda.",
};

type Props = {
    searchParams: { token?: string };
};

export default function ResetPasswordPage({ searchParams }: Props) {
    const { token } = searchParams;

    // No token = redirect to forgot-password
    if (!token) {
        redirect("/forgot-password");
    }

    return (
        <div className="container-page py-12 md:py-20 flex items-center justify-center min-h-[70vh]">
            <ResetPasswordForm token={token} />
        </div>
    );
}
