export type UserRole =
  | "user"
  | "admin"
  | "astrologer"
  | "support";

export function isAdmin(role?: string | null) {
  return role === "admin";
}

export function canAccessAdmin(role?: string | null) {
  return role === "admin";
}