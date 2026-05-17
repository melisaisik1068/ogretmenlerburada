"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

type RoleChoice = "student" | "teacher" | "parent";

export function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get("next") || "/dashboard";
  const [role, setRole] = useState<RoleChoice>("student");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== passwordConfirm) {
      setError("Şifreler uyuşmuyor. Lütfen kontrol edin.");
      return;
    }
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
      const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
      if (!res.ok) {
        setPassword("");
        setPasswordConfirm("");
        const detail = data.detail;
        if (typeof detail === "string" && detail.trim()) {
          setError(detail);
          return;
        }
        // Django REST: çoğu validasyon { username: ["…"], email: ["…"] } şeklinde (detail yok)
        const skip = new Set(["registered", "detail"]);
        const parts: string[] = [];
        for (const [k, v] of Object.entries(data)) {
          if (skip.has(k)) continue;
          if (v == null) continue;
          const text = Array.isArray(v) ? v.map((x) => String(x)).join(", ") : String(v);
          if (text.trim()) parts.push(`${k}: ${text}`);
        }
        if (typeof detail === "object" && detail !== null && !Array.isArray(detail)) {
          for (const [k, v] of Object.entries(detail as Record<string, unknown>)) {
            const text = Array.isArray(v) ? v.map((x) => String(x)).join(", ") : String(v);
            if (text.trim()) parts.push(`${k}: ${text}`);
          }
        }
        setError(
          parts.length > 0 ? parts.join(" · ") : `Sunucu yanıtı: ${res.status}. Ağ / API adresi veya tekrarlı kayıt kontrol edin.`,
        );
        return;
      }
      // Kayıt başarılı ama otomatik oturum açılamadı — login sayfasına yönlendir
      if (data.registered && !data.ok) {
        router.push("/login?kayit=basarili");
        return;
      }
      if (role === "parent") {
        router.push("/dashboard/veli");
      } else if (role === "teacher") {
        router.push("/dashboard/teacher");
      } else {
        router.push(nextUrl.startsWith("/") ? nextUrl : "/dashboard");
      }
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="mt-6 grid gap-5" onSubmit={onSubmit}>
      <div className="grid gap-2 sm:grid-cols-3">
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
          <div className="mt-1 text-xs text-slate-600">İçerik paylaşmak için kayıt — belge onayı sonrası yayına geçersin.</div>
        </button>
        <button
          type="button"
          onClick={() => setRole("parent")}
          className={`rounded-3xl border border-white/25 bg-white/55 p-5 text-left backdrop-blur-md ring-1 transition ${
            role === "parent" ? "ring-2 ring-amber-400/80" : "ring-slate-200/80 hover:shadow-md"
          }`}
        >
          <div className="text-sm font-extrabold text-slate-900">Veli</div>
          <div className="mt-1 text-xs text-slate-600">Çocuğunun sınav ve derslerini takip et.</div>
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

      <label className="grid gap-1">
        <span className="text-xs font-semibold text-slate-700">Şifre Tekrar</span>
        <input
          type="password"
          autoComplete="new-password"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
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
