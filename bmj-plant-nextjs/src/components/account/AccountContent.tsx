"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import { toast } from "sonner";
import { updateProfile, getProfile } from "@/lib/actions/profile-actions";
import PasswordChangeForm from "@/components/account/PasswordChangeForm";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    Package, MapPin, Heart, User, ArrowLeft, LogOut, Loader2,
} from "lucide-react";
import { OrderHistory } from "./OrderHistory";
import { AddressList } from "./AddressList";
import { WishlistSection } from "./WishlistSection";

type TabKey = "orders" | "addresses" | "wishlist" | "profile";

const tabConfig: { key: TabKey; label: string; icon: typeof Package }[] = [
    { key: "orders", label: "Pesanan", icon: Package },
    { key: "addresses", label: "Alamat", icon: MapPin },
    { key: "wishlist", label: "Wishlist", icon: Heart },
    { key: "profile", label: "Profil", icon: User },
];

export function AccountContent() {
    const searchParams = useSearchParams();
    const { data: session, status } = useSession();
    const initialTab = (searchParams?.get("tab") as TabKey) || "orders";
    const [activeTab, setActiveTab] = useState<TabKey>(initialTab);

    // ── Loading state ──
    if (status === "loading") {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    // ── No session guard (defense-in-depth — middleware is primary guard) ──
    if (!session?.user) {
        return (
            <div className="max-w-md mx-auto text-center py-20">
                <User className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
                <h1 className="font-serif text-2xl font-bold mb-2">Login Diperlukan</h1>
                <p className="text-muted-foreground mb-6">
                    Silakan login untuk mengakses akun Anda.
                </p>
                <Button asChild>
                    <Link href="/login?callbackUrl=/account">Masuk</Link>
                </Button>
            </div>
        );
    }

    const handleTabChange = (tab: TabKey) => {
        setActiveTab(tab);
        window.history.replaceState(null, "", `/account?tab=${tab}`);
    };

    const handleSignOut = async () => {
        await signOut({ callbackUrl: "/" });
    };

    return (
        <div className="max-w-[1000px] mx-auto px-4 py-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="font-serif text-xl md:text-2xl font-bold">Akun Saya</h1>
                        {session?.user?.name && (
                            <p className="text-sm font-medium text-foreground">{session.user.name}</p>
                        )}
                        <p className="text-xs text-muted-foreground">{session?.user?.email || ""}</p>
                    </div>
                </div>
                <Button variant="outline" size="sm" className="gap-2" onClick={handleSignOut}>
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Keluar</span>
                </Button>
            </div>

            <div className="flex gap-1 mb-6 overflow-x-auto scrollbar-hide">
                {tabConfig.map(({ key, label, icon: Icon }) => (
                    <button
                        key={key}
                        onClick={() => handleTabChange(key)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${activeTab === key ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}
                    >
                        <Icon className="w-4 h-4" />
                        {label}
                    </button>
                ))}
            </div>

            <Separator className="mb-6" />

            <div>
                {activeTab === "orders" && <OrderHistory />}
                {activeTab === "addresses" && <AddressList />}
                {activeTab === "wishlist" && <WishlistSection />}
                {activeTab === "profile" && <ProfileSection />}
            </div>
        </div>
    );
}

function ProfileSection() {
    const { data: session } = useSession();
    const user = session?.user;
    const [name, setName] = useState(user?.name || "");
    const [phone, setPhone] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        async function load() {
            const profile = await getProfile();
            if (profile) {
                setName(profile.name);
                setPhone(profile.phone);
            }
            setLoaded(true);
        }
        load();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        const result = await updateProfile({ name, phone });
        setIsSaving(false);
        if (result.error) {
            toast.error(result.error);
        } else {
            toast.success("Profil berhasil disimpan");
        }
    };

    if (!loaded) return <div className="animate-pulse h-40 bg-muted rounded-lg" />;

    return (
        <div className="space-y-8">
            <form onSubmit={handleSave} className="space-y-4">
                <h2 className="font-semibold text-lg">Profil Saya</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-sm text-muted-foreground">Nama</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm text-muted-foreground">Email</label>
                        <input type="email" value={user?.email || ""} readOnly className="w-full px-3 py-2 border rounded-lg text-sm bg-muted cursor-not-allowed" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm text-muted-foreground">Telepon</label>
                        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="08xxxxxxxxxx" className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary" />
                    </div>
                </div>
                <button type="submit" disabled={isSaving} className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors">
                    {isSaving ? "Menyimpan..." : "Simpan Profil"}
                </button>
            </form>
            <hr />
            <PasswordChangeForm />
        </div>
    );
}
