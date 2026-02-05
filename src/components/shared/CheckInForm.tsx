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
  AlertDialogAction,
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



export function CheckInForm({ room }: { room: Room }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  // Langkah 1: Validasi form sebelum buka AlertDialog
  const handlePreSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsConfirmOpen(true) // Buka konfirmasi final
  }

  // Langkah 2: Eksekusi Server Action setelah konfirmasi
  const handleFinalSubmit = async () => {
    if (!formRef.current) return

    const formData = new FormData(formRef.current)
    formData.append("roomId", room.id)
    formData.append("price", room.price.toString())

    const promise = createTenant(formData)

    toast.promise(promise, {
      loading: 'Memproses data penghuni & tagihan...',
      success: (data) => {
        if (!data.success) throw new Error(data.error)
        setIsDialogOpen(false)
        return `Check-in ${formData.get("name")} berhasil!`
      },
      error: (err) => err.message || "Gagal memproses check-in.",
    })
  }

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <span className="absolute inset-0 z-10 cursor-pointer" />
        </DialogTrigger>
        <DialogContent className="bg-[#0A0A0A] border-white/10 rounded-[2.5rem] text-white sm:max-w-md z-100">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black tracking-tighter">
              Check-in <span className="text-[#D4AF37]">Unit {room.roomNumber}</span>
            </DialogTitle>
            <DialogDescription className="text-white/40">
              Pastikan data penghuni sudah sesuai dengan KTP.
            </DialogDescription>
          </DialogHeader>
          <form ref={formRef} onSubmit={handlePreSubmit} className="space-y-5 pt-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-white/60 pl-1">Nama Lengkap</Label>
              <Input id="name" name="name" placeholder="Nama sesuai identitas" className="bg-white/5 border-white/10 rounded-xl focus:border-[#D4AF37]/50 h-12" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className="text-xs font-bold uppercase tracking-widest text-white/60 pl-1">Nomor WhatsApp</Label>
              <Input id="phoneNumber" name="phoneNumber" placeholder="081234567xxx" className="bg-white/5 border-white/10 rounded-xl focus:border-[#D4AF37]/50 h-12" required />
            </div>
            <Button type="submit" className="w-full bg-[#D4AF37] hover:bg-[#F9E498] text-black font-black rounded-xl py-6 mt-2 transition-all shadow-[0_10px_20px_rgba(212,175,55,0.2)]">
              Proses Check-in
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* AlertDialog Konfirmasi Final */}
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent className="bg-[#0A0A0A] border-white/10 rounded-[2rem] text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-black text-[#D4AF37]">Konfirmasi Check-in</AlertDialogTitle>
            <AlertDialogDescription className="text-white/40">
              Apakah Anda yakin ingin memproses check-in ini? Sistem akan otomatis membuat tagihan bulan pertama untuk penghuni tersebut.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3">
            <AlertDialogCancel className="bg-white/5 border-white/10 rounded-xl hover:bg-white/10 hover:text-white transition-all">Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleFinalSubmit} className="bg-[#D4AF37] hover:bg-[#F9E498] text-black font-bold rounded-xl border-none">
              Ya, Konfirmasi
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}