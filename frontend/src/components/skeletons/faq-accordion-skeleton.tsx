export function FaqAccordionSkeleton() {
  return (
    <div className="space-y-3" aria-busy aria-label="Yükleniyor">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-14 animate-pulse rounded-2xl bg-slate-100" />
      ))}
    </div>
  );
}
