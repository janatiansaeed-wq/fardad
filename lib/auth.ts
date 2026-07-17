export const AUTH_ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  EDITOR: "EDITOR",
  PHOTOGRAPHER: "PHOTOGRAPHER",
  CUSTOMER: "CUSTOMER",
} as const;

export type AuthRole = typeof AUTH_ROLES[keyof typeof AUTH_ROLES];

export const PUBLIC_ROUTES = [
  "/",
  "/products",
  "/about",
  "/contact",
  "/blog",
];

export function hasRole(userRole: AuthRole, allowed: AuthRole[]) {
  return allowed.includes(userRole);
}
