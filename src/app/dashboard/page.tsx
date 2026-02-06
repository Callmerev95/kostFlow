import { redirect } from "next/navigation";
import { getDashboardStats } from "@/actions/dashboard";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { HeaderSection } from "@/components/dashboard/header-section";
import { StatsGrid } from "@/components/dashboard/stats-grid";
import { RevenueChart } from "@/components/dashboard/revenue-chart"
import { RecentActivity } from "@/components/dashboard/recent-activity"
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

    <div className="flex flex-col h-full min-h-0 space-y-8 animate-in fade-in duration-700 overflow-hidden">

      {/* 1. Header Dashboard  */}
      <div className="shrink-0">
        <HeaderSection userName={profile?.name || "Premium User"} />
      </div>

      {/* 2. Scrollable Content Area */}
      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pb-30">
        <div className="space-y-8 pr-1">

          <StatsGrid
            stats={stats}
            income={income}
            overdueCount={overdueCount}
          />

          {/* Grid untuk Chart & Activity */}
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <RevenueChart />
            </div>

            {/* RECENT ACTIVITY */}
            <div className="h-full">
              <RecentActivity />
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}