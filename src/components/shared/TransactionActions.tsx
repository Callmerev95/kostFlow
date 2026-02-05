"use client"

import { Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { confirmPayment } from "@/actions/transactions"
import { ViewProofModal } from "./ViewProofModal"
import { useState } from "react"
import { toast } from "sonner"
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
}

export function TransactionActions({
  id,
  status,
  proofUrl,
  tenantName
}: TransactionActionsProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleConfirm = async () => {
    setIsLoading(true)

    // Pakai toast.promise biar user tahu proses sedang berjalan
    toast.promise(confirmPayment(id), {
      loading: `Mengonfirmasi pembayaran ${tenantName}...`,
      success: (res) => {
        if (res.error) throw new Error(res.error)
        return `Pembayaran ${tenantName} berhasil dikonfirmasi!`
      },
      error: (err) => err.message || "Gagal mengonfirmasi pembayaran",
      finally: () => setIsLoading(false)
    })
  }

  // Jika sudah PAID, kita tampilkan status statis saja
  if (status === "PAID") {
    return (
      <div className="flex items-center justify-end gap-2">
        {proofUrl && <ViewProofModal proofUrl={proofUrl} tenantName={tenantName} />}
        <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-100">
          Terverifikasi
        </span>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-end gap-2">
      {/* Tombol Lihat Bukti (Hanya muncul jika Tenant sudah upload) */}
      {proofUrl && (
        <ViewProofModal proofUrl={proofUrl} tenantName={tenantName} />
      )}

      {/* Dialog Konfirmasi Pembayaran */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            size="sm"
            variant="outline"
            className="h-8 text-green-600 border-green-200 hover:bg-green-50"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="mr-1 h-3 w-3 animate-spin" />
            ) : (
              <Check className="mr-1 h-3 w-3" />
            )}
            Konfirmasi
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Verifikasi Pembayaran?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini akan menandai tagihan <strong>{tenantName}</strong> sebagai lunas.
              Pastikan Anda sudah mengecek dana masuk di rekening/e-wallet Anda.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Ya, Konfirmasi
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}