"use client"

import { MoreHorizontal, Pencil, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { deleteRoom } from "@/actions/rooms"
import { useState } from "react"
import { Room } from "@prisma/client"
import { EditRoomForm } from "./EditRoomForm"


/**
 * Komponen aksi untuk setiap baris kamar.
 * Menggunakan tipe data Room dari Prisma untuk menghindari penggunaan 'any'.
 */
export function RoomActions({ room }: { room: Room }) {
  const [isLoading, setIsLoading] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)

  const handleDelete = async () => {
    // Standard browser confirm, bisa kita ganti Dialog Shadcn nanti agar lebih cantik
    if (confirm(`Apakah Anda yakin ingin menghapus kamar ${room.roomNumber}?`)) {
      setIsLoading(true)
      try {
        await deleteRoom(room.id)
      } catch (error) {
        console.error("Gagal menghapus kamar:", error)
        alert("Gagal menghapus kamar.")
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Buka menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem className="cursor-pointer"
            onClick={() => setIsEditOpen(true)}
          >
            <Pencil className="mr-2 h-4 w-4" /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer text-red-600 focus:text-red-600"
            onClick={handleDelete}
            disabled={isLoading}
          >
            <Trash className="mr-2 h-4 w-4" />
            {isLoading ? "Menghapus..." : "Hapus"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <EditRoomForm
        room={room}
        open={isEditOpen}
        setOpen={setIsEditOpen}
      />
    </>


  )
}