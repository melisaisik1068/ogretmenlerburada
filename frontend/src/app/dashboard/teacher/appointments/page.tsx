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

export default function TeacherAppointmentsPage() {
  const [me, setMe] = useState<UserMe | null>(null);
  const [avail, setAvail] = useState<TeacherAvailability[]>([]);
  const [appts, setAppts] = useState<Appointment[]>([]);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const [weekday, setWeekday] = useState(1);
  const [startT, setStartT] = useState("09:00");
  const [endT, setEndT] = useState("10:00");

  const loadMe = useCallback(async () => {
    const res = await fetch("/api/auth/session", { cache: "no-store" });
    const j = (await res.json()) as { user?: UserMe | null };
    setMe(j.user ?? null);
  }, []);

  const loadAvail = useCallback(async () => {
    const res = await fetch("/api/booking/availabilities", { cache: "no-store" });
    const j = await res.json().catch(() => []);
    setAvail(Array.isArray(j) ? j : (j.results ?? []));
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
    if (me?.role !== "teacher") return;
    void loadAvail();
    void loadAppts();
  }, [me, loadAvail, loadAppts]);

  async function addAvailability() {
    setErr(null);
    setMsg(null);
    const res = await fetch("/api/booking/availabilities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ weekday, start_time: startT, end_time: endT, is_active: true }),
    });
    const j = await res.json().catch(() => ({}));
    if (!res.ok) {
      setErr(typeof j.detail === "string" ? j.detail : JSON.stringify(j));
      return;
    }
    setMsg("Müsaitlik eklendi.");
    await loadAvail();
  }

  async function removeAvailability(id: number) {
    setErr(null);
    const res = await fetch(`/api/booking/availabilities/${id}`, { method: "DELETE" });
    if (!res.ok && res.status !== 204) {
      const j = await res.json().catch(() => ({}));
      setErr(typeof j.detail === "string" ? j.detail : "Silinemedi");
      return;
    }
    await loadAvail();
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
    setMsg("Randevu güncellendi.");
    await loadAppts();
  }

  if (me && me.role !== "teacher") {
    return (
      <main className="container-page py-10">
        <p className="text-sm text-slate-600">Bu sayfa yalnızca öğretmen hesapları içindir.</p>
        <Link href="/dashboard" className="btn-outline mt-4 inline-flex h-10 px-4">
          Panele dön
        </Link>
      </main>
    );
  }

  return (
    <main className="container-page py-8 sm:py-12">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="section-eyebrow">Canlı ders</div>
          <h1 className="section-title mt-1">Randevu ve müsaitlik</h1>
          <p className="section-lead mt-2 max-w-2xl">
            Haftalık müsait bloklarınızı ekleyin; onaylı öğrenciler randevu oluşturur. Onay sonrası Meet / Zoom / Jitsi linkini
            girin — öğrenci panelinde &quot;Derse katıl&quot; ile açılır.
          </p>
        </div>
        <Link href="/dashboard" className="btn-outline h-10 px-4">
          Özet
        </Link>
      </div>

      {msg ? <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">{msg}</p> : null}
      {err ? <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900">{err}</p> : null}

      <section className="mt-10 surface p-6 sm:p-8">
        <h2 className="text-lg font-extrabold text-slate-900">Müsaitliklerim</h2>
        <p className="mt-1 text-sm text-slate-600">Öğrenciler randevu alırken bu saat aralıklarını rehber olarak görebilir.</p>

        <div className="mt-4 flex flex-wrap items-end gap-3">
          <label className="grid gap-1 text-xs font-semibold text-slate-600">
            Gün
            <select
              className="h-10 min-w-[10rem] rounded-xl bg-white px-3 text-sm ring-1 ring-slate-200 outline-none focus:ring-2 focus:ring-sky-200"
              value={weekday}
              onChange={(e) => setWeekday(Number(e.target.value))}
            >
              {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                <option key={d} value={d}>
                  {WEEKDAY_TR[d]}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-1 text-xs font-semibold text-slate-600">
            Başlangıç
            <input
              type="time"
              className="h-10 rounded-xl bg-white px-3 text-sm ring-1 ring-slate-200 outline-none focus:ring-2 focus:ring-sky-200"
              value={startT}
              onChange={(e) => setStartT(e.target.value)}
            />
          </label>
          <label className="grid gap-1 text-xs font-semibold text-slate-600">
            Bitiş
            <input
              type="time"
              className="h-10 rounded-xl bg-white px-3 text-sm ring-1 ring-slate-200 outline-none focus:ring-2 focus:ring-sky-200"
              value={endT}
              onChange={(e) => setEndT(e.target.value)}
            />
          </label>
          <button type="button" className="btn-accent h-10 px-4" onClick={() => void addAvailability()}>
            Ekle
          </button>
        </div>

        <ul className="mt-6 divide-y divide-slate-200 text-sm">
          {avail.length ? (
            avail.map((a) => (
              <li key={a.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                <span>
                  {WEEKDAY_TR[a.weekday] ?? a.weekday}: {a.start_time.slice(0, 5)} – {a.end_time.slice(0, 5)}
                  {!a.is_active ? <span className="ml-2 text-xs text-amber-700">(pasif)</span> : null}
                </span>
                <button type="button" className="text-xs font-semibold text-red-700 underline" onClick={() => void removeAvailability(a.id)}>
                  Sil
                </button>
              </li>
            ))
          ) : (
            <li className="py-4 text-slate-500">Henüz müsaitlik yok.</li>
          )}
        </ul>
      </section>

      <section className="mt-8 surface p-6 sm:p-8">
        <h2 className="text-lg font-extrabold text-slate-900">Randevularım</h2>
        <p className="mt-1 text-sm text-slate-600">
          Bekleyen talepleri onaylayın, canlı ders linkini yazın, ders bitince tamamlayın.
        </p>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs font-bold uppercase tracking-wide text-slate-500">
                <th className="py-2 pr-3">Öğrenci</th>
                <th className="py-2 pr-3">Zaman</th>
                <th className="py-2 pr-3">Durum</th>
                <th className="py-2 pr-3">Toplantı linki</th>
                <th className="py-2">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {appts.map((row) => (
                <AppointmentTeacherRow key={row.id} row={row} onPatch={patchAppointment} />
              ))}
            </tbody>
          </table>
          {!appts.length ? <p className="mt-4 text-sm text-slate-500">Henüz randevu yok.</p> : null}
        </div>
      </section>
    </main>
  );
}

function AppointmentTeacherRow({
  row,
  onPatch,
}: {
  row: Appointment;
  onPatch: (id: number, body: Record<string, unknown>) => Promise<void>;
}) {
  const [link, setLink] = useState(row.meeting_url ?? "");

  useEffect(() => {
    setLink(row.meeting_url ?? "");
  }, [row.meeting_url]);

  const stLabel = APPOINTMENT_STATUS_TR[row.status] ?? row.status;
  const studentLabel =
    [row.student.first_name, row.student.last_name].filter(Boolean).join(" ").trim() || row.student.username;

  return (
    <tr className="border-b border-slate-100 align-top">
      <td className="py-3 pr-3 font-medium text-slate-900">{studentLabel}</td>
      <td className="py-3 pr-3 text-slate-600">{formatRange(row.starts_at, row.ends_at)}</td>
      <td className="py-3 pr-3 text-slate-700">{stLabel}</td>
      <td className="py-3 pr-3">
        <input
          className="h-9 w-full min-w-[200px] max-w-xs rounded-lg bg-white px-2 text-xs ring-1 ring-slate-200 outline-none focus:ring-2 focus:ring-sky-200"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="https://meet.google.com/..."
          disabled={row.status === "canceled" || row.status === "completed"}
        />
      </td>
      <td className="py-3">
        <div className="flex flex-wrap gap-2">
          {row.status === "pending" ? (
            <button
              type="button"
              className="btn-solid h-9 px-3 text-xs"
              onClick={() => void onPatch(row.id, { status: "confirmed", meeting_url: link })}
            >
              Onayla
            </button>
          ) : null}
          {row.status === "confirmed" ? (
            <>
              <button type="button" className="btn-outline h-9 px-3 text-xs" onClick={() => void onPatch(row.id, { meeting_url: link })}>
                Linki kaydet
              </button>
              <button type="button" className="btn-accent h-9 px-3 text-xs" onClick={() => void onPatch(row.id, { status: "completed" })}>
                Tamamla
              </button>
            </>
          ) : null}
          {row.status === "pending" || row.status === "confirmed" ? (
            <button type="button" className="btn-outline h-9 px-3 text-xs text-red-800" onClick={() => void onPatch(row.id, { status: "canceled" })}>
              İptal
            </button>
          ) : null}
          {row.status === "confirmed" && (row.meeting_url || link) ? (
            <a
              href={row.meeting_url || link}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline h-9 px-3 text-xs"
            >
              Odaya git
            </a>
          ) : null}
        </div>
      </td>
    </tr>
  );
}
