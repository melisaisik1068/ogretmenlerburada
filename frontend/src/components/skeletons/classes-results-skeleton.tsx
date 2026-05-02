/** Liste yüklenirken CLS’i düşük tutmak için kart iskeleti */
export function ClassesResultsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" aria-busy aria-label="Yükleniyor">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          <div className="h-40 animate-pulse bg-slate-100" />
          <div className="space-y-2 p-4">
            <div className="h-3 w-20 animate-pulse rounded bg-slate-200" />
            <div className="h-5 w-[85%] animate-pulse rounded bg-slate-200" />
            <div className="h-3 w-full animate-pulse rounded bg-slate-100" />
          </div>
        </div>
      ))}
    </div>
  );
}
