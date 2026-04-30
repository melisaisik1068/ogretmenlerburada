"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

import { LoginForm } from "@/components/auth/login-form";
import { SignupForm } from "@/components/auth/signup-form";

type Props = {
  defaultTab?: "login" | "signup";
};

export function AuthModal({ defaultTab = "login" }: Props) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"login" | "signup">(defaultTab);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button type="button" className="btn-outline h-10" onClick={() => { setTab("login"); setOpen(true); }}>
        Giriş Yap
      </button>
      <button type="button" className="btn-accent h-10" onClick={() => { setTab("signup"); setOpen(true); }}>
        Ücretsiz Üye Ol
      </button>

      {open ? (
        <div className="fixed inset-0 z-100">
          <button
            type="button"
            className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"
            aria-label="Close"
            onClick={() => setOpen(false)}
          />
          <div className="absolute left-1/2 top-1/2 w-[min(720px,92vw)] -translate-x-1/2 -translate-y-1/2">
            <div className="surface p-6 sm:p-8">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="section-eyebrow">{tab === "login" ? "Sign In" : "Register"}</div>
                  <div className="mt-1 text-xl font-extrabold tracking-tight text-slate-900">
                    {tab === "login" ? "Giriş Yap" : "Ücretsiz Üye Ol"}
                  </div>
                </div>
                <button type="button" className="rounded-xl border border-slate-200 bg-white p-2 hover:bg-slate-50" onClick={() => setOpen(false)}>
                  <X className="h-4 w-4" aria-hidden />
                </button>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <button
                  type="button"
                  className={tab === "login" ? "badge bg-slate-900 text-white ring-1 ring-slate-900" : "badge hover:bg-slate-100"}
                  onClick={() => setTab("login")}
                >
                  Login
                </button>
                <button
                  type="button"
                  className={tab === "signup" ? "badge bg-slate-900 text-white ring-1 ring-slate-900" : "badge hover:bg-slate-100"}
                  onClick={() => setTab("signup")}
                >
                  Register
                </button>
              </div>

              <div className="mt-4">
                {tab === "login" ? <LoginForm /> : <SignupForm />}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

