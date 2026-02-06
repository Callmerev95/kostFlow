"use client"

import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { checkOutTenant } from "@/actions/tenants"
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

interface TenantActionsProps {
  tenantId: string
  roomId: string
  tenantName: string
  isMobile?: boolean
}

export function TenantActions({ tenantId, roomId, tenantName, isMobile }: TenantActionsProps) {
  const handleCheckOut = async () => {
    const promise = checkOutTenant(tenantId, roomId)

    toast.promise(promise, {
      loading: `Memproses check-out ${tenantName}...`,
      success: (result) => {
        if (result?.error) throw new Error(result.error)
        return `${tenantName} telah resmi meninggalkan unit.`;
      },
      error: (err) => err.message || "Gagal memproses check-out.",
    })
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size={isMobile ? "lg" : "sm"}
          className={cn(
            "bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20 hover:text-red-400 rounded-xl transition-all active:scale-95",
            isMobile ? "w-full py-7 font-black text-base gap-3 justify-center shadow-lg shadow-red-500/5" : "px-4 flex items-center gap-2 ml-auto"
          )}
        >
          <LogOut size={isMobile ? 18 : 14} strokeWidth={2.5} />
          {isMobile ? "Proses Check-out Sekarang" : "Check-out"}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-[#0A0A0A] border-white/10 rounded-[2rem] text-white w-[90vw] max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-black text-red-500">Konfirmasi Akhir</AlertDialogTitle>
          <AlertDialogDescription className="text-white/40">
            Apakah Anda yakin ingin melakukan check-out pada <strong>{tenantName}</strong>?
            Unit akan segera berstatus <span className="text-green-500 font-bold">Tersedia</span> kembali.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-3 mt-4">
          <AlertDialogCancel className="bg-white/5 border-white/10 rounded-xl hover:bg-white/10 hover:text-white transition-all h-12">
            Batal
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleCheckOut}
            className="bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl border-none transition-all h-12"
          >
            Ya, Check-out
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}