import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ROLE_IDS } from "@/lib/constants/roles";
import type { Metadata } from "next";
import { PagesAdminSidebar } from "@/components/staff/PagesAdminSidebar";

export const metadata: Metadata = {
  title: "Pages Settings | Admin",
  description: "Kelola konten halaman website",
};

export default async function PagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login?callbackUrl=/manage/pages");
  if (session.user.roleId !== ROLE_IDS.ADMIN) redirect("/");

  return (
    <div className="flex min-h-screen bg-[#f5f3ee]">
      <PagesAdminSidebar />
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
