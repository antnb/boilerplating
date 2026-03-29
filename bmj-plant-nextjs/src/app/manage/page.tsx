// Server Component — server-side admin auth check + client view in Suspense
// BOTH auth AND admin role required — admin panel must not be accessible to buyers
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ROLE_IDS } from "@/lib/constants/roles";
import StaffDashboardPage from "@/views/StaffDashboardPage";

export default async function Page() {
    const session = await getServerSession(authOptions);
    if (!session?.user) redirect("/login?callbackUrl=/manage");
    if (session.user.roleId !== ROLE_IDS.ADMIN) redirect("/");

    return (
        <Suspense>
            <StaffDashboardPage />
        </Suspense>
    );
}
