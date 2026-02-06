import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { UploadProofModal } from "@/components/shared/UploadProofModal"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { PaymentInstructions } from "@/components/shared/PaymentInstructions"
import Image from "next/image"
import { ShieldCheck, User, Home, Calendar, Wallet } from "lucide-react"

export default async function PublicPaymentPage(props: { params: Promise<{ token: string }> }) {
  const { token } = await props.params;

  const transaction = await prisma.transaction.findUnique({
    where: { token },
    include: {
      tenant: {
        include: {
          room: true,
          user: true
        }
      }
    }
  })

  if (!transaction || !transaction.tenant) return notFound();

  const { tenant } = transaction;
  const owner = tenant.user;

  const detailDate = format(new Date(transaction.year, transaction.month - 1, 5), "d MMMM yyyy", { locale: id });

  const formatIDR = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 selection:bg-[#D4AF37]/30">
      {/* Background Decorative Element */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#D4AF37]/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="w-full max-w-md relative animate-in fade-in zoom-in duration-700">
        {/* Main Card Container */}
        <div className="bg-[#0A0A0A] border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl shadow-black">

          {/* Header Section */}
          <div className="bg-white/2 border-b border-white/5 p-8 text-center relative">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] text-[10px] font-black uppercase tracking-widest mb-6">
              <ShieldCheck size={12} strokeWidth={3} /> Official Invoice
            </div>

            <h1 className="text-white font-black text-3xl tracking-tighter uppercase leading-none">
              {owner.kostName || "Kost-Pulse"}
            </h1>

            <div className="flex items-center justify-center gap-3 mt-4">
              <div className="flex items-center gap-1.5 py-1 px-3 rounded-lg bg-white/5 border border-white/5 text-white/60 text-[11px] font-bold">
                <User size={12} className="text-[#D4AF37]" /> {tenant.name}
              </div>
              <div className="flex items-center gap-1.5 py-1 px-3 rounded-lg bg-white/5 border border-white/5 text-white/60 text-[11px] font-bold">
                <Home size={12} className="text-[#D4AF37]" /> Kamar {tenant.room.roomNumber}
              </div>
            </div>
          </div>

          <div className="p-8 space-y-8">
            {/* Detail Transaksi Card */}
            <div className="bg-white/5 rounded-[2rem] p-6 border border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              </div>

              <div className="grid grid-cols-2 gap-4 relative z-10">
                <div className="space-y-1">
                  <p className="text-[10px] text-white/20 uppercase font-black tracking-widest flex items-center gap-1.5">
                    <Calendar size={10} /> Periode
                  </p>
                  <p className="text-white font-bold text-sm tracking-tight">{detailDate}</p>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-[10px] text-white/20 uppercase font-black tracking-widest flex items-center gap-1.5 justify-end">
                    <Wallet size={10} /> Total Bayar
                  </p>
                  <p className="text-[#D4AF37] text-xl font-black tracking-tighter">{formatIDR(transaction.amount)}</p>
                </div>
              </div>
            </div>

            {/* Instruksi Pembayaran (Tabs) */}
            {!transaction.paymentProof && (
              <div className="animate-in slide-in-from-bottom duration-500 delay-150">
                <PaymentInstructions user={owner} />
              </div>
            )}

            {/* Status & Upload Section */}
            <div className="pt-2">
              {transaction.paymentProof ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-green-400 justify-center bg-green-500/5 py-4 rounded-2xl border border-green-500/10">
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Pembayaran Berhasil</span>
                  </div>

                  <div className="relative aspect-3/4 w-full rounded-[2.5rem] border border-white/5 overflow-hidden shadow-inner bg-white/5 group">
                    <Image
                      src={transaction.paymentProof}
                      alt="Bukti Transfer"
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-60" />
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-white/20 justify-center italic">
                    <div className="h-px w-8 bg-white/5" />
                    <p className="text-[10px] font-medium tracking-tight uppercase">Upload Bukti Transfer</p>
                    <div className="h-px w-8 bg-white/5" />
                  </div>
                  <UploadProofModal transactionId={transaction.id} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <p className="mt-8 text-center text-white/20 text-[10px] font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-2">
          <ShieldCheck size={12} /> Powered by KostFlow Security
        </p>
      </div>
    </div>
  )
}