"use client"

import { LogOut, Edit3 } from "lucide-react"
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
import { EditTenantModal } from "./EditTenantModal"

interface TenantActionsProps {
  tenantId: string
  roomId: string
  tenantName: string
  phoneNumber: string
  isMobile?: boolean
}

export function TenantActions({
  tenantId,
  roomId,
  tenantName,
  phoneNumber,
  isMobile
}: TenantActionsProps) {

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

  // Common button style for consistency
  const btnBaseClass = "rounded-xl transition-all active:scale-95 font-bold uppercase tracking-widest text-[10px]"
  const mobileBtnClass = "w-full py-4 h-auto flex items-center justify-center gap-2 border"
  const desktopBtnClass = "px-4 h-9 gap-2"

  return (
    <div className={cn(
      "flex items-center gap-3",
      isMobile ? "grid grid-cols-2 w-full mt-4" : "justify-end"
    )}>

      {/* 1. EDIT ACTION */}
      <EditTenantModal
        tenant={{
          id: tenantId,
          name: tenantName,
          phoneNumber: phoneNumber
        }}
        customTrigger={
          <Button
            variant="outline"
            className={cn(
              btnBaseClass,
              "bg-[#D4AF37]/5 text-[#D4AF37] border-[#D4AF37]/20 hover:bg-[#D4AF37]/10",
              isMobile ? mobileBtnClass : desktopBtnClass
            )}
          >
            <Edit3 size={isMobile ? 16 : 14} strokeWidth={2.5} />
            {isMobile ? "Ubah Data" : "Edit"}
          </Button>
        }
      />

      {/* 2. CHECK-OUT ACTION */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              btnBaseClass,
              "bg-red-500/5 text-red-500 border-red-500/20 hover:bg-red-500/10",
              isMobile ? mobileBtnClass : desktopBtnClass
            )}
          >
            <LogOut size={isMobile ? 20 : 14} strokeWidth={2.5} />
            {isMobile ? "Check-out" : "Check-out"}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="bg-[#0A0A0A] border-white/10 rounded-[2rem] text-white w-[90vw] max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-black text-red-500 italic">Konfirmasi Akhir</AlertDialogTitle>
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
    </div>
  )
}