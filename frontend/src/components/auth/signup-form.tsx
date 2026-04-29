"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type RoleChoice = "student" | "teacher";

export function SignupForm() {
  const router = useRouter();
  const [role, setRole] = useState<RoleChoice>("student");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          email: email.trim(),
          password,
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          role,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { detail?: string | Record<string, unknown>; registered?: boolean };
      if (!res.ok) {
        const detail = data.detail;
        const msg =
          typeof detail === "string"
            ? detail
            : detail && typeof detail === "object"
              ? Object.entries(detail)
                  .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : String(v)}`)
                  .join(" ")
              : "Kayıt tamamlanamadı.";
        setError(msg);
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="mt-6 grid gap-5" onSubmit={onSubmit}>
      <div className="grid gap-2 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => setRole("student")}
          className={`rounded-3xl border border-white/25 bg-white/55 p-5 text-left backdrop-blur-md ring-1 transition ${
            role === "student" ? "ring-2 ring-sky-400/80" : "ring-slate-200/80 hover:shadow-md"
          }`}
        >
          <div className="text-sm font-extrabold text-slate-900">Öğrenci</div>
          <div className="mt-1 text-sm text-slate-600">İçerikleri izleyebilir, materyallere erişebilirsin.</div>
        </button>
        <button
          type="button"
          onClick={() => setRole("teacher")}
          className={`rounded-3xl border border-white/25 bg-white/55 p-5 text-left backdrop-blur-md ring-1 transition ${
            role === "teacher" ? "ring-2 ring-emerald-400/80" : "ring-slate-200/80 hover:shadow-md"
          }`}
        >
          <div className="text-sm font-extrabold text-slate-900">Öğretmen</div>
          <div className="mt-1 text-sm text-slate-600">İçerik paylaşmak için kayıt — belge onayı sonrası yayına geçersin.</div>
        </button>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
          {error}
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="grid gap-1">
          <span className="text-xs font-semibold text-slate-700">Ad</span>
          <input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="h-11 rounded-xl bg-white px-4 text-sm ring-1 ring-slate-200 outline-none focus:ring-2 focus:ring-sky-200"
          />
        </label>
        <label className="grid gap-1">
          <span className="text-xs font-semibold text-slate-700">Soyad</span>
          <input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="h-11 rounded-xl bg-white px-4 text-sm ring-1 ring-slate-200 outline-none focus:ring-2 focus:ring-sky-200"
          />
        </label>
      </div>

      <label className="grid gap-1">
        <span className="text-xs font-semibold text-slate-700">Kullanıcı adı</span>
        <input
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          minLength={3}
          className="h-11 rounded-xl bg-white px-4 text-sm ring-1 ring-slate-200 outline-none focus:ring-2 focus:ring-sky-200"
        />
      </label>

      <label className="grid gap-1">
        <span className="text-xs font-semibold text-slate-700">E-posta</span>
        <input
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-11 rounded-xl bg-white px-4 text-sm ring-1 ring-slate-200 outline-none focus:ring-2 focus:ring-sky-200"
        />
      </label>

      <label className="grid gap-1">
        <span className="text-xs font-semibold text-slate-700">Şifre (en az 8 karakter)</span>
        <input
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          className="h-11 rounded-xl bg-white px-4 text-sm ring-1 ring-slate-200 outline-none focus:ring-2 focus:ring-sky-200"
        />
      </label>

      <button type="submit" disabled={loading} className="btn-accent mt-1 w-full disabled:opacity-60">
        {loading ? "Kaydediliyor…" : "Hesap oluştur"}
      </button>

      <div className="text-center text-sm text-slate-600">
        Zaten hesabın var mı?{" "}
        <Link className="font-semibold text-slate-900 underline decoration-slate-300 underline-offset-4" href="/login">
          Giriş yap
        </Link>
      </div>
    </form>
  );
}
