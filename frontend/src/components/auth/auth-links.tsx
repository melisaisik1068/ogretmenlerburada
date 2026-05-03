"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type SessionUser = { username?: string; first_name?: string; last_name?: string };

export function AuthLinks() {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/auth/session", { cache: "no-store" });
        const data = (await res.json()) as { user?: SessionUser | null };
        if (!cancelled) setUser(data.user ?? null);
      } catch {
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.refresh();
  }

  if (loading) {
    return (
      <div className="hidden items-center gap-2 md:flex">
        <div className="h-10 w-24 animate-pulse rounded-xl bg-slate-100" aria-hidden />
      </div>
    );
  }

  if (user) {
    const label = [user.first_name, user.last_name].filter(Boolean).join(" ").trim() || user.username || "Hesap";
    return (
      <div className="hidden items-center gap-2 md:flex">
        <Link className="btn-outline h-10 px-3 text-xs font-semibold sm:text-sm" href="/dashboard" title={label}>
          Panel
        </Link>
        <button type="button" className="btn-solid h-10 px-3 text-xs font-semibold sm:text-sm" onClick={() => void logout()}>
          Çıkış
        </button>
      </div>
    );
  }

  return (
    <div className="hidden items-center gap-2 md:flex">
      <Link href="/login" className="btn-outline h-10">
        Giriş Yap
      </Link>
      <Link href="/signup" className="btn-accent h-10">
        Ücretsiz Üye Ol
      </Link>
    </div>
  );
}
