/** Hero altı gecikmeli chunk — boşluk sabit, üst üste binme yok */
export function HomeBelowFoldSkeleton() {
  return (
    <div className="min-h-[48vh] w-full bg-[var(--background)]" aria-hidden>
      <div className="container-page space-y-6 py-10 opacity-40">
        <div className="h-40 animate-pulse rounded-3xl bg-slate-200/60" />
        <div className="grid gap-4 md:grid-cols-12">
          <div className="h-56 animate-pulse rounded-3xl bg-slate-200/50 md:col-span-7" />
          <div className="grid grid-cols-2 gap-3 md:col-span-5">
            <div className="h-28 animate-pulse rounded-3xl bg-slate-200/50" />
            <div className="h-28 animate-pulse rounded-3xl bg-slate-200/50" />
          </div>
        </div>
      </div>
    </div>
  );
}
