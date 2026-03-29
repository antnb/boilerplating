// Server Component — server-side auth check + client AccountContent in Suspense
// Defense-in-depth: middleware protects page rendering, this protects RSC data
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AccountContent } from "@/components/account/AccountContent";

export const dynamic = 'force-dynamic';

export default async function Page() {
    const session = await getServerSession(authOptions);
    if (!session?.user) redirect("/login?callbackUrl=/account");

    return (
        <Suspense>
            <AccountContent />
        </Suspense>
    );
}
