/** Shape returned by getCachedTeamMembers() — matches Prisma select */
export type TeamMemberDB = {
  id: string;
  shortName: string;
  title: string;
  bio: string | null;
  avatar: string | null;
  badge: string | null;
  staffRole: string;
  user: { name: string | null };
};
