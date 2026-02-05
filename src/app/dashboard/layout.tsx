import { Sidebar } from "@/components/layouts/Sidebar";
import { BottomNav } from "@/components/layouts/bottom-nav";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

/**
 * Server-Side Dashboard Layout
 * Menggunakan standar Async Component untuk fetching data sebelum render.
 */
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

  // Proteksi Route: Jika tidak ada session, langsung redirect
  if (!user) {
    redirect("/login");
  }

  // Fetch data profile secara paralel dari Prisma
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
    <div className="flex min-h-screen bg-[#0F0F0F] text-white">
      {/* Sidebar Desktop (Hidden di Mobile) */}
      <div className="hidden lg:block">
        <Sidebar userName={userName} kostName={kostName} />
      </div>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header - THE FINISHING TOUCH */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-[#0F0F0F]/80 backdrop-blur-md sticky top-0 z-40">
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

        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="p-4 md:p-8">
            {children}
          </div>
        </main>
        {/* Bottom Navigation untuk Mobile */}
        <BottomNav />
      </div>
    </div>
  );
}