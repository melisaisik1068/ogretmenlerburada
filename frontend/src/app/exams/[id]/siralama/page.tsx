import Link from "next/link";
import { notFound } from "next/navigation";

import { SiteFooter } from "@/components/footer-dynamic";
import { TopNav } from "@/components/nav";
import { getApiBaseUrl } from "@/lib/env";

type LeaderRow = {
  rank: number;
  display_name: string;
  net_score: string;
  correct_count: number;
};

async function loadLeaderboard(id: string): Promise<{ exam_id: number; results: LeaderRow[] } | null> {
  const base = getApiBaseUrl();
  try {
    const res = await fetch(`${base}/api/exams/exams/${id}/leaderboard/`, { next: { revalidate: 30 } });
    if (!res.ok) return null;
    return (await res.json()) as { exam_id: number; results: LeaderRow[] };
  } catch {
    return null;
  }
}

export default async function ExamLeaderboardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await loadLeaderboard(id);
  if (!data) notFound();

  return (
    <div className="relative min-h-dvh bg-white text-slate-900">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 mesh-bg" />
      <TopNav />
      <main className="container-page py-10 sm:py-12">
        <Link href={`/exams/${id}`} className="text-sm font-medium text-[var(--brand-blue)] hover:underline">
          ← Sınav
        </Link>
        <h1 className="mt-4 section-title">Türkiye geneli sıralama</h1>
        <p className="section-lead">Bu sınava giren öğrenciler arasında net sıralaması.</p>

        <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3 font-semibold">Sıra</th>
                <th className="px-4 py-3 font-semibold">Öğrenci</th>
                <th className="px-4 py-3 font-semibold">Net</th>
                <th className="px-4 py-3 font-semibold">Doğru</th>
              </tr>
            </thead>
            <tbody>
              {data.results.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                    Henüz tamamlanan oturum yok.
                  </td>
                </tr>
              ) : (
                data.results.map((r) => (
                  <tr key={r.rank} className="border-t border-slate-100">
                    <td className="px-4 py-3 font-bold text-[var(--brand-navy)]">#{r.rank}</td>
                    <td className="px-4 py-3">{r.display_name}</td>
                    <td className="px-4 py-3 font-semibold">{r.net_score}</td>
                    <td className="px-4 py-3">{r.correct_count}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
