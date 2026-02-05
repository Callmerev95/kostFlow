import { redirect } from "next/navigation";
import { getDashboardStats } from "@/actions/dashboard";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { HeaderSection } from "@/components/dashboard/header-section";
import { StatsGrid } from "@/components/dashboard/stats-grid";
import { RevenueChart } from "@/components/dashboard/revenue-chart"
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get(name: string) { return cookieStore.get(name)?.value } } }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect("/login");

  // Ambil data profile untuk Header
  const profile = await prisma.user.findUnique({
    where: { id: user.id },
    select: { name: true }
  });

  const { stats, income, overdueCount } = await getDashboardStats(user.id);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <HeaderSection userName={profile?.name || "Premium User"} />

      <StatsGrid
        stats={stats}
        income={income}
        overdueCount={overdueCount}
      />

      {/* Grid untuk Chart & Activity */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* CHART: Ambil 2 kolom di desktop */}
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>

        {/* RECENT ACTIVITY: Ambil 1 kolom */}
        <div className="bg-white/2 border border-white/5 rounded-[2rem] p-6">
          <h3 className="text-lg font-black tracking-tight text-white mb-6">Aktivitas Terbaru</h3>
          {/* Kita akan isi di step berikutnya */}
          <div className="space-y-4">
            <p className="text-white/20 text-xs font-bold uppercase tracking-widest text-center py-10">
              Processing feeds...
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}