"use client"

import { Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { confirmPayment } from "@/actions/transactions"
import { ViewProofModal } from "./ViewProofModal"
import { useState } from "react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface TransactionActionsProps {
  id: string
  status: string
  hasProof: boolean
  proofUrl?: string | null
  tenantName: string
  isMobile?: boolean
}

export function TransactionActions({ id, status, proofUrl, tenantName, isMobile }: TransactionActionsProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleConfirm = async () => {
    setIsLoading(true)
    const promise = confirmPayment(id)

    toast.promise(promise, {
      loading: `Memverifikasi pembayaran ${tenantName}...`,
      success: (res) => {
        if (res?.error) throw new Error(res.error)
        return `Pembayaran ${tenantName} telah diverifikasi!`
      },
      error: (err) => err.message || "Gagal verifikasi pembayaran",
      finally: () => setIsLoading(false)
    })
  }

  if (status === "PAID") {
    return (
      <div className={cn("flex items-center gap-2", isMobile ? "w-full" : "justify-end")}>
        {proofUrl && <ViewProofModal proofUrl={proofUrl} tenantName={tenantName} isMobile={isMobile} />}

        {/* Update Visual Status Terverifikasi (Non-Clickable) */}
        <div className={cn(
          "bg-green-500/5 text-green-500/50 border border-green-500/10 rounded-xl flex items-center gap-2 select-none cursor-default",
          isMobile
            ? "flex-1 justify-center h-14 text-[10px] font-black uppercase tracking-[0.2em]"
            : "h-9 px-4 text-[9px] font-bold uppercase tracking-widest"
        )}>
          <div className="w-1.5 h-1.5 rounded-full bg-green-500/40" /> {/* Indikator Titik Statis */}
          Terverifikasi
        </div>
      </div>
    )
  }

  return (
    <div className={cn("flex items-center gap-2", isMobile ? "w-full" : "justify-end")}>
      {proofUrl && <ViewProofModal proofUrl={proofUrl} tenantName={tenantName} isMobile={isMobile} />}

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            size={isMobile ? "lg" : "sm"}
            variant="outline"
            className={cn(
              "h-9 text-green-500 border-green-500/20 bg-green-500/10 hover:bg-green-500/20 rounded-xl font-bold transition-all",
              isMobile ? "flex-1 h-12.5 text-sm gap-2" : "h-9 px-4 ml-auto"
            )}
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
            Konfirmasi
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="bg-[#0A0A0A] border-white/10 rounded-[2.5rem] text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-black tracking-tighter">
              Verifikasi <span className="text-[#D4AF37]">Pembayaran?</span>
            </AlertDialogTitle>
            <AlertDialogDescription className="text-white/40">
              Menandai tagihan <strong>{tenantName}</strong> sebagai lunas. Pastikan saldo sudah masuk ke rekening Anda.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3 mt-4">
            <AlertDialogCancel className="bg-white/5 border-white/10 rounded-xl hover:bg-white/10 hover:text-white transition-all h-12">Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm} className="bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl h-12 border-none transition-all">
              Ya, Verifikasi
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}