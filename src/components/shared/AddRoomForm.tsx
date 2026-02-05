"use client"

import { createRoom } from "@/actions/rooms"
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
import { Plus } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

export function AddRoomForm({ userId }: { userId: string }) {
  const [open, setOpen] = useState(false)

  async function handleSubmit(formData: FormData) {
    // Bungkus server action dengan toast.promise
    const promise = createRoom(formData, userId)

    toast.promise(promise, {
      loading: 'Mendaftarkan unit baru...',
      success: () => {
        setOpen(false)
        return `Kamar ${formData.get("roomNumber")} berhasil ditambahkan!`
      },
      error: 'Gagal menambah kamar. Silakan cek data Anda.',
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#D4AF37] hover:bg-[#F9E498] text-black font-black px-6 rounded-xl flex items-center gap-2 transition-all shadow-[0_10px_20px_rgba(212,175,55,0.2)] active:scale-95">
          <Plus size={18} strokeWidth={3} /> Tambah Unit
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#0A0A0A] border-white/10 rounded-[2.5rem] text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black tracking-tighter">
            Tambah <span className="text-[#D4AF37]">Unit Baru</span>
          </DialogTitle>
          <DialogDescription className="text-white/40 font-medium">
            Masukkan detail unit kost untuk mulai disewakan.
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-5 pt-4">
          <div className="space-y-2">
            <Label htmlFor="roomNumber" className="text-xs font-bold uppercase tracking-widest text-white/60 pl-1">Nomor Kamar</Label>
            <Input
              id="roomNumber"
              name="roomNumber"
              placeholder="Contoh: A-01"
              className="bg-white/5 border-white/10 rounded-xl focus:border-[#D4AF37]/50 h-12 transition-all"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price" className="text-xs font-bold uppercase tracking-widest text-white/60 pl-1">Harga Sewa / Bulan</Label>
            <Input
              id="price"
              name="price"
              type="number"
              placeholder="1500000"
              className="bg-white/5 border-white/10 rounded-xl focus:border-[#D4AF37]/50 h-12 transition-all"
              required
            />
          </div>
          <Button type="submit" className="w-full bg-[#D4AF37] hover:bg-[#F9E498] text-black font-black rounded-xl py-6 mt-2 transition-all shadow-[0_10px_20px_rgba(212,175,55,0.2)]">
            Simpan Unit
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}