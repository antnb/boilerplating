import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { ROLE_IDS } from "@/shared/lib/constants/roles";

export async function getSession() {
    return await getServerSession(authOptions);
}

export async function getCurrentUser() {
    const session = await getSession();
    return session?.user ?? null;
}

export async function requireAuth() {
    const session = await getSession();
    if (!session?.user) {
        throw new Error("Unauthorized");
    }
    return session.user;
}

export async function requireAdmin() {
    const user = await requireAuth();
    if (user.roleId !== ROLE_IDS.ADMIN) {
        throw new Error("Forbidden");
    }
    return user;
}
