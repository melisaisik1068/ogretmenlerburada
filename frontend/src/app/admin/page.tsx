import { redirect } from "next/navigation";

import { getApiBaseUrl } from "@/lib/env";

export const dynamic = "force-dynamic";

/**
 * Django admin yalnızca API sunucusunda (Railway). Vercel kökünde /admin yazılsa da doğru panele gidilsin.
 */
export default function AdminRedirectPage() {
  const base = getApiBaseUrl().replace(/\/+$/, "");
  redirect(`${base}/admin/`);
}
