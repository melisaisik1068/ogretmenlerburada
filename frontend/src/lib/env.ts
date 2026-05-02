/** Sunucu tarafında Docker vb. için API_INTERNAL_URL; istemcide NEXT_PUBLIC_API_BASE_URL */
export function getApiBaseUrl(): string {
  const internal = (process.env.API_INTERNAL_URL ?? "").trim();
  if (internal) return internal;
  const publicUrl = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").trim();
  if (publicUrl) return publicUrl;
  return "http://127.0.0.1:8000";
}
