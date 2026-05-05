"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type StatusPayload = { teacher_verification_status?: string | null; is_teacher_verified?: boolean };
type DocRow = { id: number; file: string; original_filename?: string; created_at: string };

function statusBadge(s: string | null | undefined) {
  const v = (s ?? "").toLowerCase();
  if (v === "approved") return { label: "Onaylandı", cls: "badge bg-emerald-600/10 text-emerald-800 ring-1 ring-emerald-200" };
  if (v === "rejected") return { label: "Reddedildi", cls: "badge bg-red-600/10 text-red-800 ring-1 ring-red-200" };
  if (v === "pending") return { label: "Beklemede", cls: "badge bg-amber-500/15 text-amber-900 ring-1 ring-amber-200" };
  if (v === "not_required") return { label: "Gerekmez", cls: "badge bg-slate-900/5 text-slate-700 ring-1 ring-slate-200" };
  return { label: s || "—", cls: "badge" };
}

export default function TeacherVerificationPage() {
  const [status, setStatus] = useState<StatusPayload | null>(null);
  const [docs, setDocs] = useState<DocRow[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const badge = useMemo(() => statusBadge(status?.teacher_verification_status), [status?.teacher_verification_status]);

  async function loadAll() {
    setLoading(true);
    setErr(null);
    try {
      const [sRes, dRes] = await Promise.all([
        fetch("/api/teacher/verification/status", { cache: "no-store" }),
        fetch("/api/teacher/verification/documents", { cache: "no-store" }),
      ]);
      const s = (await sRes.json().catch(() => ({}))) as StatusPayload;
      const d = await dRes.json().catch(() => ({}));
      const list = Array.isArray(d) ? d : (d.results ?? []);
      setStatus(sRes.ok ? s : null);
      setDocs(list as DocRow[]);
    } catch {
      setErr("Yüklenemedi. Oturumun açık olduğundan emin ol.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadAll();
  }, []);

  async function upload() {
    setMsg(null);
    setErr(null);
    if (!file) {
      setErr("Lütfen bir dosya seçin.");
      return;
    }
    setBusy(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/teacher/verification/documents", { method: "POST", body: form });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErr(typeof data.detail === "string" ? data.detail : "Yükleme başarısız.");
        return;
      }
      setMsg("Belge yüklendi. İnceleme sonrası durum güncellenecek.");
      setFile(null);
      await loadAll();
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="container-page py-10 sm:py-12">
      <div className="section-eyebrow">Instructor</div>
      <h1 className="section-title">Öğretmen doğrulama</h1>
      <p className="section-lead mt-2 max-w-2xl">
        Öğretmen hesabınızın doğrulanması için kimlik/diploma/kurum kartı gibi evrak yükleyebilirsiniz. Belgeler admin panelinden incelenir.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link href="/dashboard/teacher/courses" className="btn-outline h-10 px-4">
          Teacher panel
        </Link>
        <Link href="/dashboard" className="btn-outline h-10 px-4">
          Panele dön
        </Link>
      </div>

      {msg ? <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">{msg}</p> : null}
      {err ? <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900">{err}</p> : null}

      <section className="mt-10 surface p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">Doğrulama durumu</h2>
            <p className="mt-1 text-sm text-slate-600">Durum: <span className={badge.cls}>{badge.label}</span></p>
          </div>
          <button type="button" className="btn-outline h-10 px-4" onClick={() => void loadAll()} disabled={loading}>
            Yenile
          </button>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
          <label className="grid gap-1 text-xs font-semibold text-slate-600">
            Belge dosyası (PDF/JPG/PNG)
            <input
              type="file"
              accept=".pdf,image/*"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="h-11 rounded-xl bg-white px-3 text-sm ring-1 ring-slate-200 outline-none focus:ring-2 focus:ring-sky-200"
              disabled={busy}
            />
          </label>
          <button type="button" className="btn-accent h-11 px-5 disabled:opacity-60" onClick={() => void upload()} disabled={busy}>
            {busy ? "Yükleniyor…" : "Belge yükle"}
          </button>
        </div>

        <div className="mt-8">
          <h3 className="text-sm font-extrabold tracking-tight text-slate-900">Yüklenen belgeler</h3>
          {loading ? (
            <p className="mt-3 text-sm text-slate-500">Yükleniyor…</p>
          ) : docs.length ? (
            <ul className="mt-3 divide-y divide-slate-200 text-sm">
              {docs.map((d) => (
                <li key={d.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                  <div className="min-w-0">
                    <div className="truncate font-medium text-slate-900">{d.original_filename || d.file || `Belge #${d.id}`}</div>
                    <div className="text-xs text-slate-500">{new Date(d.created_at).toLocaleString("tr-TR")}</div>
                  </div>
                  {d.file ? (
                    <a href={d.file} target="_blank" rel="noopener noreferrer" className="btn-outline h-9 px-3 text-xs">
                      Görüntüle
                    </a>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-slate-500">Henüz belge yüklenmedi.</p>
          )}
        </div>
      </section>
    </main>
  );
}

