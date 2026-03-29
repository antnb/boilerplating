import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { getUserByEmail, getUserRoleById } from "@/lib/data/users";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                // DAL call — never direct Prisma here (Rule #2)
                const user = await getUserByEmail(credentials.email);
                if (!user) return null;

                const passwordMatch = await bcrypt.compare(
                    credentials.password,
                    user.hashedPassword
                );
                if (!passwordMatch) return null;

                // Return only safe fields — never hashedPassword
                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role.name,    // String name for display/logging
                    roleId: user.roleId,     // Integer ID for auth comparison
                };
            },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: { strategy: "jwt" },
    pages: {
        signIn: "/login",
        error: "/login",
    },
    callbacks: {
        async jwt({ token, user }) {
            // First sign-in — user object is only present here
            if (user) {
                token.id = user.id;
                token.role = user.role as string;
                token.roleId = user.roleId as number;
            }

            // Self-heal: stale JWT missing roleId (created before Role system)
            // Per NextAuth docs, `user` is only passed on first sign-in.
            // Tokens issued before Role migration have no roleId — fetch from DB once.
            if (token.id && (token.roleId === undefined || token.roleId === null)) {
                const dbUser = await getUserRoleById(token.id as string);
                if (dbUser) {
                    token.roleId = dbUser.roleId;
                    token.role = dbUser.role.name;
                }
            }

            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
                session.user.roleId = token.roleId as number;
            }
            return session;
        },
    },
};
