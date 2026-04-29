/** Sunucu tarafında Docker vb. için API_INTERNAL_URL; istemcide NEXT_PUBLIC_API_BASE_URL */
export function getApiBaseUrl(): string {
  return (
    process.env.API_INTERNAL_URL ??
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    "http://127.0.0.1:8000"
  );
}
