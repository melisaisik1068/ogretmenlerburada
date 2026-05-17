"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { type AppRole, ROLE_LABELS, normalizeRole } from "@/lib/auth/roles";

type SessionPayload = { user?: { role?: string } | null };

function linksForRole(role: AppRole) {
  switch (role) {
    case "teacher":
      return [
        { href: "/dashboard/teacher", label: "Merkez" },
        { href: "/dashboard/teacher/courses", label: "Kurslar" },
        { href: "/dashboard/teacher/materials", label: "Mağaza" },
        { href: "/dashboard/teacher/appointments", label: "Randevu" },
        { href: "/dashboard/teacher/exams", label: "Sınav" },
        { href: "/dashboard/teacher/homework", label: "Ödev" },
        { href: "/dashboard/teacher/packages", label: "Paket" },
      ];
    case "student":
      return [
        { href: "/dashboard/ogrenci", label: "Merkez" },
        { href: "/classes", label: "Kurslar" },
        { href: "/exams", label: "Deneme" },
        { href: "/odevler", label: "Ödevler" },
        { href: "/paketler", label: "Paketler" },
        { href: "/dashboard/appointments", label: "Randevu" },
        { href: "/shop", label: "Mağaza" },
      ];
    case "parent":
      return [
        { href: "/dashboard/veli", label: "Merkez" },
        { href: "/dashboard/veli#bagla", label: "Çocuk bağla" },
      ];
    default:
      return [];
  }
}

export function DashboardRoleNav() {
  const pathname = usePathname();
  const [role, setRole] = useState<AppRole | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/auth/session", { cache: "no-store" });
        const data = (await res.json()) as SessionPayload;
        if (!cancelled) setRole(normalizeRole(data.user?.role));
      } catch {
        if (!cancelled) setRole(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  if (!role) return null;

  const links = linksForRole(role);
  if (links.length === 0) return null;

  const show =
    pathname.startsWith("/dashboard") ||
    (role === "student" && (pathname.startsWith("/exams") || pathname.startsWith("/odevler"))) ||
    pathname.startsWith("/dashboard/veli");

  if (!show) return null;

  return (
    <nav
      aria-label={`${ROLE_LABELS[role]} paneli`}
      className="border-b border-slate-200/80 bg-white/60 backdrop-blur-md"
    >
      <div className="container-page flex gap-1 overflow-x-auto py-2">
        {links.map((l) => {
          const active = pathname === l.href || (l.href !== "/dashboard/teacher" && pathname.startsWith(l.href));
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition sm:px-4 sm:text-sm ${
                active
                  ? "bg-[var(--brand-navy)] text-white"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              {l.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
