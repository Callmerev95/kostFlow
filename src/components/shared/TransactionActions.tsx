"use client"

import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { confirmPayment } from "@/actions/transactions"
import { UploadProofModal } from "./UploadProofModal"
import { useState } from "react"

/**
 * Tombol aksi untuk mengonfirmasi pembayaran pada daftar transaksi.
 */
export function TransactionActions({ id, status, hasProof }: { id: string, status: string, hasProof: boolean }) {
  const [isLoading, setIsLoading] = useState(false)

  if (status === "PAID") return <span className="text-xs text-slate-400 font-medium italic">Lunas</span>

  const handleConfirm = async () => {
    if (confirm("Apakah Anda sudah menerima pembayaran ini?")) {
      setIsLoading(true)
      await confirmPayment(id)
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-end gap-2">
      {/* Tombol Upload Bukti (Hanya muncul jika belum lunas) */}
      {status !== "PAID" && !hasProof && (
        <UploadProofModal transactionId={id} />
      )}

      {/* Indikator jika bukti sudah diupload tapi belum dikonfirmasi */}
      {hasProof && status !== "PAID" && (
        <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded-full border border-blue-100 font-medium">
          Bukti Terupload
        </span>
      )}
      <Button
        size="sm"
        variant="outline"
        className="h-8 text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700"
        onClick={handleConfirm}
        disabled={isLoading}
      >
        <Check className="mr-1 h-3 w-3" />
        {isLoading ? "..." : "Konfirmasi Bayar"}
      </Button>
    </div>
  )
}