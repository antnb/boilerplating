// src/lib/constants/roles.ts

/**
 * Role system constants — SINGLE SOURCE OF TRUTH
 *
 * DB stores: roleId (INT FK → roles table)
 * JWT stores: role name (string from Role.name)
 * Code uses: ROLE_IDS for auth comparison + DB queries, ROLE_NAMES for display/helpers only
 */

// Integer IDs matching the `roles` table (seeded values — DO NOT CHANGE ORDER)
export const ROLE_IDS = {
  ADMIN: 1,
  WRITER: 2,
  EXPERT: 3,
  STAFF: 4,
  CUSTOMER: 5,
} as const;

// String names matching `roles.name` column
// Used in JWT token comparison (token stores role NAME, not ID)
export const ROLE_NAMES = {
  ADMIN: "admin",
  WRITER: "writer",
  EXPERT: "expert",
  STAFF: "staff",
  CUSTOMER: "customer",
} as const;

export type RoleId = (typeof ROLE_IDS)[keyof typeof ROLE_IDS];
export type RoleName = (typeof ROLE_NAMES)[keyof typeof ROLE_NAMES];

/** Check if role has admin-level access (manages dashboard) */
export function isAdminRole(roleName: string): boolean {
  return roleName === ROLE_NAMES.ADMIN;
}

/** Check if role is internal staff (non-customer — has StaffProfile potential) */
export function isStaffRole(roleName: string): boolean {
  return roleName !== ROLE_NAMES.CUSTOMER;
}
