import { prisma } from "@/lib/prisma"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { redirect } from "next/navigation"
import { TransactionActions } from "@/components/shared/transactions/TransactionActions"
import { formatPhoneNumber, generatePaymentMessage } from "@/lib/whatsapp";
import { MessageCircle, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RealtimeRefresher } from "@/components/shared/RealTimeRefresher"

export default async function TransactionsPage() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get(name: string) { return cookieStore.get(name)?.value } } }
  )

  const { data: { user: authUser } } = await supabase.auth.getUser()
  if (!authUser) return redirect("/login")

  const owner = await prisma.user.findUnique({
    where: { id: authUser.id },
    select: { kostName: true }
  })

  const transactions = await prisma.transaction.findMany({
    where: { tenant: { userId: authUser.id } },
    include: { tenant: { include: { room: true } } },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="space-y-8 animate-in fade-in duration-700 ">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-white">
            Laporan <span className="text-[#D4AF37]">Keuangan</span>
          </h1>
          <p className="text-white/40 text-sm font-medium mt-1 italic">
            Pantau tagihan dan konfirmasi pembayaran masuk.
          </p>
        </div>
      </div>

      <RealtimeRefresher />
      {/* 🖥️ Desktop View: Luxury Table */}
      <div className="hidden md:block bg-white/2 border border-white/5 rounded-[2rem] overflow-hidden backdrop-blur-sm shadow-2xl">
        <Table>
          <TableHeader className="bg-white/2 border-b border-white/5">
            <TableRow className="hover:bg-transparent border-none">
              <TableHead className="text-white/40 font-bold py-5 pl-8 uppercase tracking-widest text-[10px]">Periode</TableHead>
              <TableHead className="text-white/40 font-bold uppercase tracking-widest text-[10px]">Penghuni</TableHead>
              <TableHead className="text-white/40 font-bold uppercase tracking-widest text-[10px]">Kamar</TableHead>
              <TableHead className="text-white/40 font-bold uppercase tracking-widest text-[10px]">Jumlah</TableHead>
              <TableHead className="text-white/40 font-bold uppercase tracking-widest text-[10px]">Status</TableHead>
              <TableHead className="text-right text-white/40 font-bold pr-8 uppercase tracking-widest text-[10px]">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((t) => {
              const waLink = `https://wa.me/${formatPhoneNumber(t.tenant.phoneNumber)}?text=${generatePaymentMessage(
                t.tenant.name, owner?.kostName || "Kost", t.amount, t.month, t.year, t.token || ""
              )}`;

              return (
                <TableRow key={t.id} className="border-white/5 hover:bg-white/1 transition-all group">
                  <TableCell className="py-5 pl-8 font-black text-white/80">
                    {t.month.toString().padStart(2, '0')}/{t.year}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-bold text-white tracking-tight">{t.tenant.name}</span>
                      <span className="text-[10px] text-white/30 font-medium">{t.tenant.phoneNumber}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-white/5 border-white/10 text-white/60 font-bold italic">
                      Unit {t.tenant.room.roomNumber}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-black text-[#D4AF37]">
                    Rp {t.amount.toLocaleString("id-ID")}
                  </TableCell>
                  <TableCell>
                    <Badge className={cn(
                      "font-bold uppercase tracking-tighter text-[10px]",
                      t.status === "PAID" ? "bg-green-500/10 text-green-500 border-green-500/20" :
                        t.status === "OVERDUE" ? "bg-red-500/10 text-red-500 border-red-500/20" :
                          "bg-amber-500/10 text-amber-500 border-amber-500/20"
                    )}>
                      {t.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right pr-8">
                    <div className="flex justify-end items-center gap-2">
                      {t.status !== "PAID" && (
                        <Button variant="outline" size="sm" asChild className="h-9 border-green-500/20 bg-green-500/10  hover:bg-green-500/20 rounded-xl text-green-500 font-bold transition-all">
                          <a href={waLink} target="_blank" rel="noopener noreferrer">
                            <MessageCircle className="w-3.5 h-3.5 mr-1.5" /> Whatsapp
                          </a>
                        </Button>
                      )}
                      <TransactionActions id={t.id} status={t.status} hasProof={!!t.paymentProof} proofUrl={t.paymentProof} tenantName={t.tenant.name} />
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {/* 📱 Mobile View: Finance Cards */}
      <div className="md:hidden space-y-4">
        {transactions.map((t) => {
          const waLink = `https://wa.me/${formatPhoneNumber(t.tenant.phoneNumber)}?text=${generatePaymentMessage(
            t.tenant.name, owner?.kostName || "Kost", t.amount, t.month, t.year, t.token || ""
          )}`;

          return (
            <div key={t.id} className="bg-white/2 border border-white/5 rounded-[2rem] p-6 backdrop-blur-sm relative overflow-hidden">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-[#D4AF37] font-black text-xs italic mb-1">Periode {t.month.toString().padStart(2, '0')}/{t.year}</p>
                  <h3 className="text-white font-black text-lg tracking-tight">{t.tenant.name}</h3>
                  <p className="text-white/40 text-[10px] font-medium">Unit {t.tenant.room.roomNumber}</p>
                </div>
                <Badge className={cn(
                  "font-bold uppercase tracking-tighter text-[9px]",
                  t.status === "PAID" ? "bg-green-500/10 text-green-500" : "bg-amber-500/10 text-amber-500"
                )}>
                  {t.status}
                </Badge>
              </div>

              <div className="bg-white/5 rounded-2xl p-4 mb-6">
                <p className="text-white/20 uppercase tracking-widest text-[9px] font-bold mb-1">Total Tagihan</p>
                <p className="text-white font-black text-xl">Rp {t.amount.toLocaleString("id-ID")}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {t.status !== "PAID" && (
                  <Button variant="outline" asChild className="bg-green-500/10 border-green-500/20 hover:bg-green-500/20 text-green-500 rounded-xl font-bold py-6">
                    <a href={waLink} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="w-4 h-4 mr-2" /> WhatsApp
                    </a>
                  </Button>
                )}
                <div className={cn(t.status === "PAID" ? "col-span-2" : "col-span-1")}>
                  <TransactionActions id={t.id} status={t.status} hasProof={!!t.paymentProof} proofUrl={t.paymentProof} tenantName={t.tenant.name} isMobile />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Empty State */}
      {transactions.length === 0 && (
        <div className="py-24 flex flex-col items-center justify-center text-white/20">
          <div className="p-4 rounded-full bg-white/2 mb-4 border border-white/5">
            <Wallet size={32} className="opacity-20" />
          </div>
          <p className="font-bold tracking-[0.3em] uppercase text-[10px]">Belum ada transaksi</p>
        </div>
      )}
    </div>
  )
}