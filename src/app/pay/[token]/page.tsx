import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { UploadProofModal } from "@/components/shared/pay/UploadProofModal"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { PaymentInstructions } from "@/components/shared/pay/PaymentInstructions"
import { RealtimeRefresher } from "@/components/shared/RealTimeRefresher"
import Image from "next/image"
import { ShieldCheck, User, Home, Calendar, Wallet, Clock, CheckCircle2 } from "lucide-react"

export const revalidate = 0
export default async function PublicPaymentPage(props: { params: Promise<{ token: string }> }) {
  const { token } = await props.params;

  // 1. Fetch data transaksi dengan relasi lengkap
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

  // 2. Format Tanggal & Mata Uang
  const detailDate = format(new Date(transaction.year, transaction.month - 1, 5), "d MMMM yyyy", { locale: id });

  const formatIDR = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // 3. Logika Status Dinamis
  const isPaid = transaction.status === "PAID";
  const isVerifying = !isPaid && !!transaction.paymentProof;

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 selection:bg-[#D4AF37]/30 font-sans">
      {/* Background Decorative Element */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#D4AF37]/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full" />
      </div>

      <RealtimeRefresher id={transaction.id} />

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

            {/* Content Switcher Based on Status */}
            <div className="space-y-8">
              {isPaid ? (
                /* ==========================================
                   CASE 1: PEMBAYARAN SUDAH LUNAS (PAID)
                   ========================================== */
                <div className="space-y-6 animate-in zoom-in duration-500">
                  <div className="flex flex-col items-center gap-4 text-green-400 justify-center bg-green-500/5 py-10 rounded-[2.5rem] border border-green-500/10 shadow-[0_0_40px_rgba(34,197,94,0.05)]">
                    <div className="h-16 w-16 rounded-full bg-green-500 flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                      <CheckCircle2 size={32} className="text-black" strokeWidth={3} />
                    </div>
                    <div className="text-center px-6">
                      <p className="text-base font-black uppercase tracking-[0.2em]">Pembayaran Berhasil</p>
                      <p className="text-[10px] text-green-500/50 font-medium mt-2 leading-relaxed">
                        Terima kasih, pembayaran Anda telah diverifikasi.
                      </p>
                    </div>
                  </div>

                  {/* Bukti Bayar Kecil (Opsional) */}
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                    <p className="text-[10px] text-white/20 font-black uppercase tracking-widest">Waktu Bayar</p>
                    <p className="text-[10px] text-white/60 font-bold">
                      {transaction.paidAt ? format(new Date(transaction.paidAt), "d MMM yyyy, HH:mm", { locale: id }) : "-"}
                    </p>
                  </div>
                </div>
              ) : isVerifying ? (
                /* ==========================================
                   CASE 2: SEDANG DIVERIFIKASI (UPLOADED)
                   ========================================== */
                <div className="space-y-6 animate-in fade-in duration-500">
                  <div className="flex items-center gap-3 text-[#D4AF37] justify-center bg-[#D4AF37]/5 py-4 rounded-2xl border border-[#D4AF37]/10">
                    <Clock size={14} className="animate-spin-slow" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Sedang Diverifikasi</span>
                  </div>

                  <div className="relative aspect-3/4 w-full rounded-[2.5rem] border border-white/5 overflow-hidden shadow-inner bg-white/5 group">
                    <Image
                      src={transaction.paymentProof!}
                      alt="Bukti Transfer"
                      fill
                      className="object-cover opacity-40 grayscale group-hover:opacity-60 transition-all duration-700"
                      unoptimized
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="bg-black/60 backdrop-blur-md px-5 py-2.5 rounded-full text-[9px] font-black text-white/90 uppercase tracking-[0.2em] border border-white/10">Bukti Terkirim</p>
                    </div>
                  </div>
                  <p className="text-center text-[10px] text-white/30 italic">
                    Mohon tunggu, Owner akan segera memeriksa bukti transfer Anda.
                  </p>
                </div>
              ) : (
                /* ==========================================
                   CASE 3: BELUM BAYAR (PENDING)
                   ========================================== */
                <div className="space-y-8 animate-in slide-in-from-bottom duration-500">
                  <PaymentInstructions user={owner} />

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-white/5"></div>
                    </div>
                    <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest">
                      <span className="bg-[#0A0A0A] px-4 text-white/20 italic">Konfirmasi</span>
                    </div>
                  </div>

                  <UploadProofModal transactionId={transaction.id} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <p className="mt-8 text-center text-white/20 text-[10px] font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-2">
          <ShieldCheck size={12} /> Powered by KostPulse Security
        </p>
      </div>
    </div>
  )
}