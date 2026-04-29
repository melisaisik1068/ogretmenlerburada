"use client";

import { useState } from "react";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { detail?: string };
        setError(typeof data.detail === "string" ? data.detail : "Gönderilemedi.");
        setStatus("error");
        return;
      }
      setStatus("done");
      setMessage("");
    } catch {
      setError("Ağ hatası.");
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-3xl border border-emerald-200/60 bg-emerald-50/80 px-5 py-4 text-sm text-emerald-900">
        Mesajın alındı. En kısa sürede dönüş yapacağız.
      </div>
    );
  }

  return (
    <form className="mt-6 grid max-w-xl gap-4" onSubmit={onSubmit}>
      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{error}</div>
      ) : null}
      <label className="grid gap-1">
        <span className="text-xs font-semibold text-slate-700">Ad Soyad</span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="h-11 rounded-xl bg-white px-4 text-sm ring-1 ring-slate-200 outline-none focus:ring-2 focus:ring-sky-200"
        />
      </label>
      <label className="grid gap-1">
        <span className="text-xs font-semibold text-slate-700">E-posta</span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="h-11 rounded-xl bg-white px-4 text-sm ring-1 ring-slate-200 outline-none focus:ring-2 focus:ring-sky-200"
        />
      </label>
      <label className="grid gap-1">
        <span className="text-xs font-semibold text-slate-700">Mesaj</span>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={5}
          className="rounded-xl bg-white px-4 py-3 text-sm ring-1 ring-slate-200 outline-none focus:ring-2 focus:ring-sky-200"
        />
      </label>
      <button type="submit" disabled={status === "loading"} className="btn-accent w-full max-w-xs disabled:opacity-60">
        {status === "loading" ? "Gönderiliyor…" : "Gönder"}
      </button>
    </form>
  );
}
