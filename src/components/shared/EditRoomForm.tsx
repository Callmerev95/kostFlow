"use client"

import { updateRoom } from "@/actions/rooms"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Room } from "@prisma/client"
import { toast } from "sonner"

interface EditRoomFormProps {
  room: Room
  open: boolean
  setOpen: (open: boolean) => void
}

export function EditRoomForm({ room, open, setOpen }: EditRoomFormProps) {

  async function actionHandler(formData: FormData) {
    const updatePromise = updateRoom(room.id, formData);

    toast.promise(updatePromise, {
      loading: "Menyimpan perubahan...",
      success: () => {
        setOpen(false);
        return `Unit ${room.roomNumber} berhasil diperbarui!`;
      },
      error: "Gagal memperbarui data kamar.",
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-[#0A0A0A] border-white/10 rounded-[2.5rem] text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black tracking-tighter">
            Edit <span className="text-[#D4AF37]">Unit {room.roomNumber}</span>
          </DialogTitle>
          <DialogDescription className="text-white/40">
            Ubah detail kamar di bawah ini.
          </DialogDescription>
        </DialogHeader>

        <form action={actionHandler} className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="roomNumber" className="text-xs font-bold uppercase tracking-widest text-white/60">Nomor Kamar</Label>
            <Input
              id="roomNumber"
              name="roomNumber"
              defaultValue={room.roomNumber}
              className="bg-white/5 border-white/10 rounded-xl focus:border-[#D4AF37]/50 transition-all"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price" className="text-xs font-bold uppercase tracking-widest text-white/60">Harga Sewa / Bulan</Label>
            <Input
              id="price"
              name="price"
              type="number"
              defaultValue={room.price}
              className="bg-white/5 border-white/10 rounded-xl focus:border-[#D4AF37]/50 transition-all"
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-[#D4AF37] hover:bg-[#F9E498] text-black font-black rounded-xl py-6 transition-all shadow-[0_10px_20px_rgba(212,175,55,0.2)]"
          >
            Simpan Perubahan
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}