"use client";

import { useState } from "react";
import { changePassword } from "@/lib/actions/profile-actions";
import { toast } from "sonner";

export default function PasswordChangeForm() {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword.length < 6) { toast.error("Password baru minimal 6 karakter"); return; }
        if (newPassword !== confirmPassword) { toast.error("Password baru tidak cocok"); return; }

        setIsSubmitting(true);
        const result = await changePassword({ currentPassword, newPassword });
        setIsSubmitting(false);

        if (result.error) {
            toast.error(result.error);
        } else {
            toast.success("Password berhasil diubah");
            setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="font-semibold text-base">Ubah Password</h3>
            <div className="space-y-1">
                <label className="text-sm text-muted-foreground">Password Saat Ini</label>
                <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary" />
            </div>
            <div className="space-y-1">
                <label className="text-sm text-muted-foreground">Password Baru</label>
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={6} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary" />
            </div>
            <div className="space-y-1">
                <label className="text-sm text-muted-foreground">Konfirmasi Password Baru</label>
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={6} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary" />
            </div>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors">
                {isSubmitting ? "Menyimpan..." : "Ubah Password"}
            </button>
        </form>
    );
}
