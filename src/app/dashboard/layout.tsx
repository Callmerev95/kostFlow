import { Sidebar } from "@/components/layouts/Sidebar";
import { BottomNav } from "@/components/layouts/bottom-nav";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const profile = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      name: true,
      kostName: true,
    }
  });

  const userName = profile?.name || "Premium User";
  const kostName = profile?.kostName || "KostFlow Residence";

  return (
    <div className="flex h-screen overflow-hidden bg-[#0F0F0F] text-white">
      {/* Sidebar Desktop */}
      <div className="hidden lg:block">
        <Sidebar userName={userName} kostName={kostName} />
      </div>

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header - shrink-0 agar tinggi 80px tetap konsisten */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-[#0F0F0F]/80 backdrop-blur-md shrink-0 z-40">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#D4AF37] mb-0.5">
              Command Center
            </p>
            <h2 className="text-sm font-bold text-white/90">Overview Dashboard</h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-linear-to-tr from-[#D4AF37] to-[#F9E498] p-[1.5px]">
              <div className="h-full w-full rounded-full bg-black flex items-center justify-center font-bold text-[12px] text-[#D4AF37]">
                {userName.substring(0, 2).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* MAIN CONTAINER: Kunci scroll internal ada di flex-1 dan overflow-hidden */}
        <main className="flex-1 overflow-hidden bg-[#0F0F0F] relative flex flex-col">
          <div className="flex-1 min-h-0 p-4 md:p-8 max-w-7xl mx-auto w-full flex flex-col">
            {children}
          </div>
        </main>

        {/* Bottom Navigation untuk Mobile */}
        <BottomNav />
      </div>
    </div>
  );
}