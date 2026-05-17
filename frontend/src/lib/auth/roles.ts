/** Backend accounts.UserRole ile uyumlu */
export type AppRole = "teacher" | "student" | "parent";

export const ROLE_LABELS: Record<AppRole, string> = {
  teacher: "Öğretmen",
  student: "Öğrenci",
  parent: "Veli",
};

export function normalizeRole(role: string | null | undefined): AppRole | null {
  if (role === "teacher" || role === "student" || role === "parent") return role;
  return null;
}

/** Giriş sonrası ve /dashboard yönlendirmesi */
export function getRoleHomePath(role: AppRole | string | null | undefined): string {
  const r = normalizeRole(typeof role === "string" ? role : null);
  switch (r) {
    case "teacher":
      return "/dashboard/teacher";
    case "parent":
      return "/dashboard/veli";
    case "student":
      return "/dashboard/ogrenci";
    default:
      return "/dashboard";
  }
}

/** Navbar panel linki */
export function getRolePanelPath(role: AppRole | string | null | undefined): string {
  return getRoleHomePath(role);
}

type RouteRule = {
  prefix: string;
  roles: AppRole[];
};

/** Korunan dashboard alt yolları */
export const PROTECTED_ROUTE_RULES: RouteRule[] = [
  { prefix: "/dashboard/teacher", roles: ["teacher"] },
  { prefix: "/dashboard/ogrenci", roles: ["student"] },
  { prefix: "/dashboard/veli", roles: ["parent"] },
  { prefix: "/dashboard/pro", roles: ["teacher", "student"] },
];

export function requiredRolesForPath(pathname: string): AppRole[] | null {
  for (const rule of PROTECTED_ROUTE_RULES) {
    if (pathname === rule.prefix || pathname.startsWith(`${rule.prefix}/`)) {
      return rule.roles;
    }
  }
  return null;
}

export function roleMayAccessPath(role: AppRole | null, pathname: string): boolean {
  const allowed = requiredRolesForPath(pathname);
  if (!allowed) return true;
  if (!role) return false;
  return allowed.includes(role);
}
