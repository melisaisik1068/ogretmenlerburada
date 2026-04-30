"use client";

import { useState } from "react";

type Props = {
  className?: string;
  tone?: "light" | "dark";
  inputId?: string;
};

export function NewsletterForm({ className = "", tone = "light", inputId }: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [message, setMessage] = useState<string>("");

  const inputClass =
    tone === "dark"
      ? "h-11 flex-1 rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-white/25"
      : "h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-slate-300";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const value = email.trim();
    if (!value) return;
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email: value }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; created?: boolean; detail?: string };
      if (!res.ok) {
        setStatus("error");
        setMessage(data.detail || "Abonelik başarısız. Lütfen tekrar dene.");
        return;
      }
      setStatus("ok");
      setEmail("");
      setMessage(data.created === false ? "Zaten kayıtlısın." : "Kaydın alındı. Teşekkürler!");
    } catch {
      setStatus("error");
      setMessage("Ağ hatası. Lütfen tekrar dene.");
    }
  }

  return (
    <form onSubmit={submit} className={className}>
      <input
        id={inputId}
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        className={inputClass}
        aria-label="Newsletter email"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className={tone === "dark" ? "btn-accent h-11 justify-center disabled:opacity-60" : "btn-accent justify-center disabled:opacity-60"}
      >
        {status === "loading" ? "..." : "Subscribe"}
      </button>
      {message ? (
        <div className={tone === "dark" ? "text-xs text-white/60" : "text-xs text-slate-500"}>{message}</div>
      ) : null}
    </form>
  );
}

