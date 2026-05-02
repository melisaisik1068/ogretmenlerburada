export function DashboardOverviewSkeleton() {
  return (
    <main className="container-page py-8 sm:py-12" aria-busy aria-label="Yükleniyor">
      <div className="h-5 w-24 animate-pulse rounded bg-slate-200" />
      <div className="mt-2 h-9 w-64 max-w-full animate-pulse rounded-lg bg-slate-200" />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="min-h-[200px] animate-pulse rounded-2xl border border-slate-200/80 bg-slate-50 p-6" />
        ))}
      </div>
    </main>
  );
}
