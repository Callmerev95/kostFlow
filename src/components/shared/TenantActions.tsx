"use client"

import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { checkOutTenant } from "@/actions/tenants"
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

interface TenantActionsProps {
  tenantId: string
  roomId: string
  tenantName: string
}

export function TenantActions({ tenantId, roomId, tenantName }: TenantActionsProps) {

  const handleCheckOut = async () => {
    // Menggunakan toast.promise untuk UX yang lebih interaktif
    toast.promise(checkOutTenant(tenantId, roomId), {
      loading: `Sedang memproses check-out ${tenantName}...`,
      success: (result) => {
        if (result.error) throw new Error(result.error);
        return `${tenantName} berhasil check-out. Kamar kini tersedia.`;
      },
      error: (err) => err.message || "Gagal melakukan check-out.",
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          size="sm"
          className="flex items-center gap-2 transition-all active:scale-95"
        >
          <LogOut size={14} />
          Check-out
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Konfirmasi Check-out</AlertDialogTitle>
          <AlertDialogDescription>
            Apakah Anda yakin ingin mengeluarkan <strong>{tenantName}</strong>?
            Tindakan ini akan menghapus semua data transaksi terkait dan status kamar akan kembali tersedia.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleCheckOut}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Ya, Check-out
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}