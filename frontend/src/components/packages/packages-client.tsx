"use client";

import { useState } from "react";

import type { InstitutionPackage } from "@/app/paketler/page";

export function PackagesClient({ initialPackages }: { initialPackages: InstitutionPackage[] }) {
  const [msg, setMsg] = useState("");

  async function subscribe(slug: string) {
    setMsg("");
    const res = await fetch("/api/packages/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setMsg(typeof data.detail === "string" ? data.detail : "Abonelik başlatılamadı. Giriş yaptın mı?");
      return;
    }
    setMsg(`"${(data.package as { title?: string })?.title ?? slug}" paketine abone oldun.`);
  }

  return (
    <div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {initialPackages.length === 0 ? (
          <div className="surface p-6 text-sm text-slate-600 sm:col-span-2 lg:col-span-3">
            Henüz paket tanımlanmamış. Öğretmen panelinden ekleyebilirsin.
          </div>
        ) : (
          initialPackages.map((p) => (
            <article key={p.id} className="surface flex flex-col p-6">
              <h2 className="text-lg font-extrabold text-slate-900">{p.title}</h2>
              <p className="mt-2 text-sm text-slate-600">{p.description || "—"}</p>
              <p className="mt-4 text-2xl font-bold text-[var(--brand-navy)]">
                {p.price_try} ₺
                <span className="text-sm font-normal text-slate-500"> / {p.billing_cycle_days} gün</span>
              </p>
              <ul className="mt-3 space-y-1 text-xs text-slate-600">
                {p.includes_premium_courses ? <li>✓ Premium kurslar</li> : null}
                {p.includes_all_exams ? <li>✓ Tüm deneme sınavları</li> : null}
                {p.includes_marketplace ? <li>✓ Mağaza avantajları</li> : null}
              </ul>
              <button type="button" onClick={() => void subscribe(p.slug)} className="btn-solid mt-5 h-10 px-4">
                Abone ol
              </button>
            </article>
          ))
        )}
      </div>
      {msg ? <p className="mt-6 text-center text-sm text-slate-700">{msg}</p> : null}
    </div>
  );
}
