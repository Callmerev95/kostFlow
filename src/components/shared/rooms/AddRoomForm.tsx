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
import { Plus, Loader2 } from "lucide-react" // Tambah Loader2
import { useState } from "react"
import { toast } from "sonner"

interface ActionResponse {
  success?: boolean;
  error?: string;
}

export function AddRoomForm({ userId }: { userId: string }) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false) // Tambah state loading

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    const roomNumber = formData.get("roomNumber") as string
    const promise = createRoom(formData, userId) as Promise<ActionResponse>

    toast.promise(promise, {
      loading: 'Mendaftarkan unit baru...',
      success: (res) => {
        if (res?.error) throw new Error(res.error)

        setOpen(false)
        return `Kamar ${roomNumber} berhasil ditambahkan!`
      },
      error: (err: Error) => {
        return err.message || 'Gagal menambah kamar. Silakan cek data Anda.'
      },
      finally: () => {
        setIsLoading(false)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={(val) => !isLoading && setOpen(val)}>
      <DialogTrigger asChild>
        <Button className="bg-[#D4AF37] hover:bg-[#F9E498] text-black font-black px-6 rounded-xl flex items-center gap-2 transition-all shadow-[0_10px_20px_rgba(212,175,55,0.2)] active:scale-95">
          <Plus size={18} strokeWidth={3} /> Tambah Unit
        </Button>
      </DialogTrigger>
      <DialogContent
        className="bg-[#0A0A0A] border-white/10 rounded-[2.5rem] text-white sm:max-w-md focus:outline-none"
        onPointerDownOutside={(e) => isLoading && e.preventDefault()}
        onEscapeKeyDown={(e) => isLoading && e.preventDefault()}
      >
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
              className="bg-white/5 border-white/10 rounded-xl focus:border-[#D4AF37]/50 h-12 transition-all disabled:opacity-50"
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price" className="text-xs font-bold uppercase tracking-widest text-white/60 pl-1">Harga Sewa / Bulan</Label>
            <Input
              id="price"
              name="price"
              type="number"
              placeholder="1500000"
              className="bg-white/5 border-white/10 rounded-xl focus:border-[#D4AF37]/50 h-12 transition-all disabled:opacity-50"
              required
              disabled={isLoading}
            />
          </div>
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#D4AF37] hover:bg-[#F9E498] text-black font-black rounded-xl py-6 mt-2 transition-all shadow-[0_10px_20px_rgba(212,175,55,0.2)] flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Sedang Menyimpan...
              </>
            ) : "Simpan Unit"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}