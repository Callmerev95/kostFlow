"use client"

import { createTenant } from "@/actions/tenants"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useState, useRef } from "react"
import { Room } from "@prisma/client"
import { toast } from "sonner"
import { Loader2, User, Phone } from "lucide-react"

// Interface untuk type safety
interface ActionResponse {
  success?: boolean;
  error?: string;
}

export function CheckInForm({ room }: { room: Room }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false) // WAJIB: State Loading
  const formRef = useRef<HTMLFormElement>(null)

  const handlePreSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsConfirmOpen(true)
  }

  const handleFinalSubmit = async (e: React.MouseEvent) => {
    // CEGAH default agar AlertDialog tidak menutup prematur sebelum loading selesai
    e.preventDefault()
    if (!formRef.current || isLoading) return

    setIsLoading(true)
    const formData = new FormData(formRef.current)
    formData.append("roomId", room.id)
    formData.append("price", room.price.toString())

    // Type casting agar tidak 'never'
    const promise = createTenant(formData) as unknown as Promise<ActionResponse>

    toast.promise(promise, {
      loading: 'Memproses data penghuni & tagihan...',
      success: (data) => {
        if (data?.error) throw new Error(data.error)

        // BERSIHKAN SEMUA MODAL
        setIsConfirmOpen(false)
        setIsDialogOpen(false)
        return `Check-in ${formData.get("name")} berhasil!`
      },
      error: (err) => {
        return err.message || "Gagal memproses check-in."
      },
      finally: () => {
        setIsLoading(false)
        // Jika error, pastikan dialog konfirmasi tertutup agar user bisa edit form
        setIsConfirmOpen(false)
      }
    })
  }

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={(val) => !isLoading && setIsDialogOpen(val)}>
        <DialogTrigger asChild>
          <span className="absolute inset-0 z-10 cursor-pointer" />
        </DialogTrigger>
        <DialogContent
          className="bg-[#0A0A0A] border-white/10 rounded-[2.5rem] text-white sm:max-w-md z-50"
          onPointerDownOutside={(e) => isLoading && e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle className="text-2xl font-black tracking-tighter">
              Check-in <span className="text-[#D4AF37]">Unit {room.roomNumber}</span>
            </DialogTitle>
            <DialogDescription className="text-white/40 font-medium">
              Pastikan data penghuni sudah sesuai dengan KTP.
            </DialogDescription>
          </DialogHeader>
          <form ref={formRef} onSubmit={handlePreSubmit} className="space-y-5 pt-4">
            {/* ... Input fields (Tambahkan disabled={isLoading}) ... */}
            <div className="space-y-2">

              <Label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-white/60 pl-1">
                <User size={10} />Nama Lengkap
              </Label>

              <Input id="name" name="name" disabled={isLoading} placeholder="Nama sesuai identitas" className="bg-white/5 border-white/10 rounded-xl focus:border-[#D4AF37]/50 h-12" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className="text-xs font-bold uppercase tracking-widest text-white/60 pl-1">
                <Phone size={10} />Nomor WhatsApp</Label>
              <Input id="phoneNumber" name="phoneNumber" disabled={isLoading} placeholder="081234567xxx" className="bg-white/5 border-white/10 rounded-xl focus:border-[#D4AF37]/50 h-12" required />
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#D4AF37] hover:bg-[#F9E498] text-black font-black rounded-xl py-6 mt-2 transition-all shadow-[0_10px_20px_rgba(212,175,55,0.2)]"
            >
              {isLoading ? <Loader2 className="animate-spin h-5 w-5 mx-auto" /> : "Proses Check-in"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isConfirmOpen} onOpenChange={(val) => !isLoading && setIsConfirmOpen(val)}>
        <AlertDialogContent className="bg-[#0A0A0A] border-white/10 rounded-[2rem] text-white z-100">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-black text-[#D4AF37]">Konfirmasi Check-in</AlertDialogTitle>
            <AlertDialogDescription className="text-white/40">
              Apakah Anda yakin ingin memproses check-in ini? Sistem akan otomatis membuat tagihan bulan pertama.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3 mt-4">
            <AlertDialogCancel disabled={isLoading} className="bg-white/5 border-white/10 rounded-xl hover:bg-white/10 hover:text-white transition-all">Batal</AlertDialogCancel>
            <Button
              onClick={handleFinalSubmit}
              disabled={isLoading}
              className="bg-[#D4AF37] hover:bg-[#F9E498] text-black font-bold rounded-xl border-none h-10 px-4 flex items-center gap-2"
            >
              {isLoading ? <Loader2 className="animate-spin h-4 w-4" /> : "Ya, Konfirmasi"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}