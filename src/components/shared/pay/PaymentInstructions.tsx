"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CopyButton } from "./CopyButton"
import Image from "next/image"
import { Landmark, Smartphone, QrCode, Info } from "lucide-react"

interface PaymentInstructionsProps {
  user: {
    bankName: string | null;
    accountNumber: string | null;
    accountName: string | null;
    ewalletName: string | null;
    ewalletNumber: string | null;
    qrisImage: string | null;
  }
}

export function PaymentInstructions({ user }: PaymentInstructionsProps) {
  const labelStyle = "text-[9px] text-white/30 uppercase font-black tracking-[0.2em] mb-1"
  const valueStyle = "font-bold text-white tracking-tight"
  const cardStyle = "space-y-4 bg-white/[0.03] p-5 rounded-2xl border border-white/5 mt-4 animate-in fade-in slide-in-from-top-2 duration-300"

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 px-1">
        <div className="h-5 w-1 bg-[#D4AF37] rounded-full" />
        <p className="text-xs font-black text-white uppercase tracking-widest">
          Metode Pembayaran
        </p>
      </div>

      <Tabs defaultValue="bank" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-white/5 border border-white/5 rounded-2xl p-1 h-12">
          <TabsTrigger value="bank" className="rounded-xl data-[state=active]:bg-[#D4AF37] data-[state=active]:text-black font-bold text-[11px] transition-all">
            <Landmark size={14} className="mr-2" /> BANK
          </TabsTrigger>
          <TabsTrigger value="wallet" className="rounded-xl data-[state=active]:bg-[#D4AF37] data-[state=active]:text-black font-bold text-[11px] transition-all">
            <Smartphone size={14} className="mr-2" /> WALLET
          </TabsTrigger>
          <TabsTrigger value="qris" className="rounded-xl data-[state=active]:bg-[#D4AF37] data-[state=active]:text-black font-bold text-[11px] transition-all">
            <QrCode size={14} className="mr-2" /> QRIS
          </TabsTrigger>
        </TabsList>

        {/* TAB BANK */}
        <TabsContent value="bank" className={cardStyle}>
          {user.bankName ? (
            <>
              <div className="flex justify-between items-start">
                <div>
                  <p className={labelStyle}>Institusi Bank</p>
                  <p className={valueStyle}>{user.bankName}</p>
                </div>
                <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5">
                  <Landmark size={18} className="text-[#D4AF37]" />
                </div>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5">
                <div>
                  <p className={labelStyle}>Nomor Rekening</p>
                  <p className="font-mono text-lg font-black text-[#D4AF37] tracking-wider">{user.accountNumber}</p>
                </div>
                <CopyButton text={user.accountNumber || ""} />
              </div>
              <div>
                <p className={labelStyle}>Penerima</p>
                <p className="text-sm font-bold text-white/80">{user.accountName}</p>
              </div>
            </>
          ) : <EmptyState message="Rekening Bank tidak tersedia" />}
        </TabsContent>

        {/* TAB E-WALLET */}
        <TabsContent value="wallet" className={cardStyle}>
          {user.ewalletName ? (
            <>
              <div className="flex justify-between items-start">
                <div>
                  <p className={labelStyle}>Provider E-Wallet</p>
                  <p className={valueStyle}>{user.ewalletName}</p>
                </div>
                <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5">
                  <Smartphone size={18} className="text-[#D4AF37]" />
                </div>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5">
                <div>
                  <p className={labelStyle}>Nomor HP / ID</p>
                  <p className="font-mono text-lg font-black text-[#D4AF37] tracking-wider">{user.ewalletNumber}</p>
                </div>
                <CopyButton text={user.ewalletNumber || ""} />
              </div>
              <div>
                <p className={labelStyle}>Penerima</p>
                <p className="text-sm font-bold text-white/80">{user.accountName}</p>
              </div>
            </>
          ) : <EmptyState message="Metode E-Wallet tidak tersedia" />}
        </TabsContent>

        {/* TAB QRIS */}
        <TabsContent value="qris" className={`${cardStyle} flex flex-col items-center py-8`}>
          {user.qrisImage ? (
            <>
              <div className="relative w-56 h-56 p-4 bg-white rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(255,255,255,0.05)]">
                <div className="relative w-full h-full">
                  <Image src={user.qrisImage} alt="QRIS" fill className="object-contain" unoptimized />
                </div>
              </div>
              <div className="mt-6 flex items-center gap-2 text-[#D4AF37] bg-[#D4AF37]/10 px-4 py-2 rounded-full border border-[#D4AF37]/20">
                <Info size={12} />
                <p className="text-[10px] font-black uppercase tracking-tighter">Scan via M-Bank atau E-Wallet</p>
              </div>
            </>
          ) : <EmptyState message="QRIS belum dikonfigurasi" />}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="py-8 flex flex-col items-center justify-center gap-2 opacity-30 text-center">
      <Info size={24} />
      <p className="text-[10px] font-black uppercase tracking-widest">{message}</p>
    </div>
  )
}