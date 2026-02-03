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

/**
 * Komponen Modal Form untuk menambah kamar baru.
 * Menggunakan Server Action createRoom untuk menyimpan data.
 */
export function AddRoomForm({ userId }: { userId: string }) {
  const [open, setOpen] = useState(false)

  // Fungsi untuk handle submit form
  async function handleSubmit(formData: FormData) {
    await createRoom(formData, userId)
    setOpen(false) // Tutup modal setelah berhasil
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus size={18} /> Tambah Kamar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Tambah Kamar Baru</DialogTitle>
          <DialogDescription>
            Masukkan detail kamar di sini. Klik simpan setelah selesai.
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="roomNumber">Nomor Kamar</Label>
            <Input id="roomNumber" name="roomNumber" placeholder="Contoh: A-01" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Harga Sewa (Per Bulan)</Label>
            <Input id="price" name="price" type="number" placeholder="1500000" required />
          </div>
          <Button type="submit" className="w-full">Simpan Kamar</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}