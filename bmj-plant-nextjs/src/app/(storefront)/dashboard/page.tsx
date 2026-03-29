// Server Component — server-side auth check + client view in Suspense
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ROLE_IDS } from "@/lib/constants/roles";
import BuyerDashboardPage from "@/views/BuyerDashboardPage";

export const dynamic = 'force-dynamic';

export default async function Page() {
    const session = await getServerSession(authOptions);

    // 1. No session → redirect to login
    if (!session?.user) redirect("/login?callbackUrl=/dashboard");

    // 2. Staff/Admin → this is customer-only portal, redirect to staff portal
    if (session.user.roleId !== ROLE_IDS.CUSTOMER) redirect("/manage");

    return (
        <Suspense>
            <BuyerDashboardPage />
        </Suspense>
    );
}
