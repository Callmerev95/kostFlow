import { createServerClient } from "@supabase/ssr"
import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { SettingsForm } from "@/components/shared/settings/SettingsForm"
import { ShieldCheck, CreditCard } from "lucide-react"

export default async function SettingsPage() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get(name: string) { return cookieStore.get(name)?.value } } }
  )

  const { data: { user: authUser } } = await supabase.auth.getUser()
  if (!authUser) redirect("/login")

  const user = await prisma.user.findUnique({
    where: { id: authUser.id },
    select: {
      name: true,
      kostName: true,
      bankName: true,
      accountNumber: true,
      accountName: true,
      ewalletName: true,
      ewalletNumber: true,
      qrisImage: true,
    }
  })

  if (!user) return null

  return (
    <div className="space-y-8 animate-in fade-in duration-700  max-w-2xl mx-auto md:mx-0">
      {/* Header Section */}
      <div>
        <h1 className="text-3xl font-black tracking-tighter text-white">
          Sistem <span className="text-[#D4AF37]">Pengaturan</span>
        </h1>
        <p className="text-white/40 text-sm font-medium mt-1 italic">
          Konfigurasi identitas pembayaran dan detail kost Anda.
        </p>
      </div>

      <div className="bg-white/2 border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-sm relative overflow-hidden shadow-2xl">
        {/* Subtle Decorative Glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 blur-3xl rounded-full" />

        <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/5">
          <div className="h-10 w-10 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] border border-[#D4AF37]/20">
            <CreditCard size={20} />
          </div>
          <div>
            <h2 className="text-white font-bold tracking-tight">Informasi Pembayaran</h2>
            <p className="text-white/20 text-[10px] uppercase tracking-widest font-bold">Data Invoice Penyewa</p>
          </div>
        </div>

        <SettingsForm initialData={user} userId={authUser.id} />
      </div>

      <div className="flex items-center gap-2 justify-center text-white/10 text-[10px] uppercase tracking-[0.3em] font-black">
        <ShieldCheck size={12} /> Secure Cloud Configuration
      </div>
    </div>
  )
}