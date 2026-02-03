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
import { UserPlus } from "lucide-react"
import { useState } from "react"
import { Room } from "@prisma/client"

/**
 * Komponen Modal untuk proses Check-in penghuni baru ke kamar tertentu.
 * Mengupdate data penghuni dan status kamar secara atomik.
 */
export function CheckInForm({ room }: { room: Room }) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    const result = await createTenant(formData, room.id)
    setIsLoading(false)

    if (result.success) {
      setOpen(false)
    } else {
      alert(result.error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <UserPlus size={14} /> Check-in
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Check-in Kamar {room.roomNumber}</DialogTitle>
          <DialogDescription>
            Masukkan data penghuni baru untuk kamar ini.
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Penghuni</Label>
            <Input id="name" name="name" placeholder="Nama Lengkap" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Nomor WhatsApp</Label>
            <Input id="phoneNumber" name="phoneNumber" placeholder="0812..." required />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Memproses..." : "Konfirmasi Check-in"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}