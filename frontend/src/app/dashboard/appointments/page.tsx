"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import type { Appointment, TeacherAvailability } from "@/lib/types/booking";
import { APPOINTMENT_STATUS_TR, WEEKDAY_TR } from "@/lib/booking-labels";
import type { UserMe } from "@/lib/types/api";

function formatRange(isoStart: string, isoEnd: string) {
  try {
    const a = new Date(isoStart);
    const b = new Date(isoEnd);
    return `${a.toLocaleString("tr-TR")} → ${b.toLocaleString("tr-TR")}`;
  } catch {
    return `${isoStart} → ${isoEnd}`;
  }
}

type TeacherBrief = Pick<UserMe, "id" | "username" | "first_name" | "last_name">;

export default function StudentAppointmentsPage() {
  const [me, setMe] = useState<UserMe | null>(null);
  const [teachers, setTeachers] = useState<TeacherBrief[]>([]);
  const [slots, setSlots] = useState<TeacherAvailability[]>([]);
  const [appts, setAppts] = useState<Appointment[]>([]);
  const [teacherId, setTeacherId] = useState("");
  const [startsLocal, setStartsLocal] = useState("");
  const [endsLocal, setEndsLocal] = useState("");
  const [note, setNote] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const loadMe = useCallback(async () => {
    const res = await fetch("/api/auth/session", { cache: "no-store" });
    const j = (await res.json()) as { user?: UserMe | null };
    setMe(j.user ?? null);
  }, []);

  const loadTeachers = useCallback(async () => {
    const res = await fetch("/api/public/teachers?page_size=60", { cache: "no-store" });
    const j = await res.json().catch(() => ({}));
    const list = Array.isArray(j) ? j : (j.results ?? []);
    setTeachers(list);
  }, []);

  const loadAppts = useCallback(async () => {
    const res = await fetch("/api/booking/appointments?page_size=100", { cache: "no-store" });
    const j = await res.json().catch(() => []);
    setAppts(Array.isArray(j) ? j : (j.results ?? []));
  }, []);

  useEffect(() => {
    void loadMe();
  }, [loadMe]);

  useEffect(() => {
    if (me?.role !== "student") return;
    void loadTeachers();
    void loadAppts();
  }, [me, loadTeachers, loadAppts]);

  useEffect(() => {
    if (!teacherId) {
      setSlots([]);
      return;
    }
    let alive = true;
    (async () => {
      const res = await fetch(`/api/booking/public-slots?teacher=${encodeURIComponent(teacherId)}`, { cache: "no-store" });
      const j = await res.json().catch(() => []);
      if (!alive) return;
      setSlots(Array.isArray(j) ? j : []);
    })();
    return () => {
      alive = false;
    };
  }, [teacherId]);

  async function createAppointment(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setMsg(null);
    if (!teacherId || !startsLocal || !endsLocal) {
      setErr("Öğretmen, başlangıç ve bitiş seçin.");
      return;
    }
    const starts_at = new Date(startsLocal).toISOString();
    const ends_at = new Date(endsLocal).toISOString();
    const res = await fetch("/api/booking/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        teacher_id: Number(teacherId),
        starts_at,
        ends_at,
        note: note.trim(),
      }),
    });
    const j = await res.json().catch(() => ({}));
    if (!res.ok) {
      setErr(typeof j.detail === "string" ? j.detail : JSON.stringify(j));
      return;
    }
    setMsg("Randevu talebin gönderildi. Öğretmen onayından sonra link görünür.");
    setNote("");
    await loadAppts();
  }

  async function patchAppointment(id: number, body: Record<string, unknown>) {
    setErr(null);
    setMsg(null);
    const res = await fetch(`/api/booking/appointments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const j = await res.json().catch(() => ({}));
    if (!res.ok) {
      setErr(typeof j.detail === "string" ? j.detail : JSON.stringify(j));
      return;
    }
    setMsg("Güncellendi.");
    await loadAppts();
  }

  if (me && me.role !== "student") {
    return (
      <main className="container-page py-10">
        <p className="text-sm text-slate-600">Randevu oluşturmak için öğrenci hesabı gerekir.</p>
        <Link href="/dashboard/teacher/appointments" className="btn-outline mt-4 inline-flex h-10 px-4">
          Öğretmen randevu sayfası
        </Link>
      </main>
    );
  }

  const fieldClass =
    "h-11 w-full rounded-xl bg-white px-4 text-sm ring-1 ring-slate-200 outline-none focus:ring-2 focus:ring-sky-200";

  return (
    <main className="container-page py-8 sm:py-12">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="section-eyebrow">Canlı ders</div>
          <h1 className="section-title mt-1">Randevularım</h1>
          <p className="section-lead mt-2 max-w-2xl">
            Onaylı öğretmen seçip zaman aralığı belirleyin. Öğretmen onayladığında toplantı linki burada görünür; tek tıkla derse
            katılırsınız.
          </p>
        </div>
        <Link href="/dashboard" className="btn-outline h-10 px-4">
          Özet
        </Link>
      </div>

      {msg ? <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">{msg}</p> : null}
      {err ? <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900">{err}</p> : null}

      <section className="mt-10 surface p-6 sm:p-8">
        <h2 className="text-lg font-extrabold text-slate-900">Yeni randevu talebi</h2>
        <form className="mt-4 grid max-w-xl gap-4" onSubmit={(e) => void createAppointment(e)}>
          <label className="grid gap-1 text-xs font-semibold text-slate-600">
            Öğretmen
            <select className={fieldClass} value={teacherId} onChange={(e) => setTeacherId(e.target.value)} required>
              <option value="">Seçin…</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {[t.first_name, t.last_name].filter(Boolean).join(" ").trim() || t.username}
                </option>
              ))}
            </select>
          </label>
          {slots.length > 0 ? (
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700">
              <div className="font-semibold text-slate-900">Öğretmenin paylaştığı müsaitlik özetleri</div>
              <ul className="mt-2 list-inside list-disc">
                {slots.map((s) => (
                  <li key={s.id}>
                    {WEEKDAY_TR[s.weekday]} {s.start_time.slice(0, 5)}–{s.end_time.slice(0, 5)}
                  </li>
                ))}
              </ul>
            </div>
          ) : teacherId ? (
            <p className="text-xs text-slate-500">Bu öğretmen henüz müsaitlik eklememiş; yine de talep gönderebilirsiniz.</p>
          ) : null}
          <label className="grid gap-1 text-xs font-semibold text-slate-600">
            Başlangıç
            <input className={fieldClass} type="datetime-local" value={startsLocal} onChange={(e) => setStartsLocal(e.target.value)} required />
          </label>
          <label className="grid gap-1 text-xs font-semibold text-slate-600">
            Bitiş
            <input className={fieldClass} type="datetime-local" value={endsLocal} onChange={(e) => setEndsLocal(e.target.value)} required />
          </label>
          <label className="grid gap-1 text-xs font-semibold text-slate-600">
            Not (isteğe bağlı)
            <textarea className={`${fieldClass} min-h-[88px] py-3`} value={note} onChange={(e) => setNote(e.target.value)} rows={3} />
          </label>
          <button type="submit" className="btn-accent h-11 w-full sm:w-auto">
            Talep gönder
          </button>
        </form>
      </section>

      <section className="mt-8 surface p-6 sm:p-8">
        <h2 className="text-lg font-extrabold text-slate-900">Randevu listem</h2>
        <ul className="mt-4 divide-y divide-slate-200 text-sm">
          {appts.map((a) => {
            const teacherLabel =
              [a.teacher.first_name, a.teacher.last_name].filter(Boolean).join(" ").trim() || a.teacher.username;
            const join = a.status === "confirmed" && a.meeting_url;
            return (
              <li key={a.id} className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="font-semibold text-slate-900">{teacherLabel}</div>
                  <div className="text-slate-600">{formatRange(a.starts_at, a.ends_at)}</div>
                  <div className="text-xs text-slate-500">{APPOINTMENT_STATUS_TR[a.status] ?? a.status}</div>
                  {a.note ? <div className="mt-1 text-xs text-slate-600">Not: {a.note}</div> : null}
                </div>
                <div className="flex flex-wrap gap-2">
                  {join ? (
                    <a href={a.meeting_url} target="_blank" rel="noopener noreferrer" className="btn-accent h-10 px-4">
                      Derse katıl
                    </a>
                  ) : null}
                  {a.status === "pending" || a.status === "confirmed" ? (
                    <button type="button" className="btn-outline h-10 px-4 text-red-800" onClick={() => void patchAppointment(a.id, { status: "canceled" })}>
                      İptal et
                    </button>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
        {!appts.length ? <p className="mt-2 text-sm text-slate-500">Henüz randevun yok.</p> : null}
      </section>
    </main>
  );
}
