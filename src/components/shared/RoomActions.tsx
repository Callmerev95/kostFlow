"use client"

import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteRoom } from "@/actions/rooms";
import { useState } from "react";
import { Room } from "@prisma/client";
import { EditRoomForm } from "./EditRoomForm";
import { toast } from "sonner";

export function RoomActions({ room }: { room: Room }) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleDelete = async () => {
    // Gunakan toast.promise untuk UX yang lebih pro
    const deletePromise = deleteRoom(room.id);

    toast.promise(deletePromise, {
      loading: `Menghapus unit ${room.roomNumber}...`,
      success: () => `Unit ${room.roomNumber} berhasil dihapus.`,
      error: "Gagal menghapus unit. Silakan coba lagi.",
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-10 w-10 p-0 rounded-xl hover:bg-white/5 text-white/40 hover:text-[#D4AF37] transition-all">
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-[#0F0F0F] border-white/10 text-white rounded-2xl p-2 w-40">
          <DropdownMenuItem onClick={() => setIsEditOpen(true)} className="rounded-xl cursor-pointer focus:bg-white/5 focus:text-[#D4AF37]">
            <Pencil className="mr-2 h-4 w-4" /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setIsDeleteOpen(true)}
            className="rounded-xl cursor-pointer text-red-500 focus:bg-red-500/10 focus:text-red-500"
          >
            <Trash className="mr-2 h-4 w-4" /> Hapus
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* AlertDialog Konfirmasi Hapus */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent className="bg-[#0A0A0A] border-white/10 rounded-[2rem] text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-black">Hapus Unit {room.roomNumber}?</AlertDialogTitle>
            <AlertDialogDescription className="text-white/40">
              Tindakan ini tidak dapat dibatalkan. Data kamar akan dihapus permanen dari sistem.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3">
            <AlertDialogCancel className="bg-white/5 border-white/10 rounded-xl hover:bg-white/10 hover:text-white transition-all">
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl border-none shadow-[0_10px_20px_rgba(220,38,38,0.2)]"
            >
              Ya, Hapus Unit
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <EditRoomForm room={room} open={isEditOpen} setOpen={setIsEditOpen} />
    </>
  );
}