"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * Mengambil semua daftar kamar berdasarkan ID pemilik (User).
 */
export async function getRooms(userId: string) {
  return await prisma.room.findMany({
    where: { userId },
    orderBy: { roomNumber: "asc" },
  });
}

/**
 * Menambah unit kamar baru ke database.
 * Melakukan revalidatePath agar UI langsung terupdate setelah data masuk.
 */
export async function createRoom(formData: FormData, userId: string) {
  const roomNumber = formData.get("roomNumber") as string;
  const price = parseInt(formData.get("price") as string);
  try {
    await prisma.room.create({
      data: {
        roomNumber,
        price,
        userId,
        status: "AVAILABLE",
      },
    });

    // Membersihkan cache agar data terbaru muncul di dashboard
    revalidatePath("/dashboard/rooms");
    return { success: true };
  } catch (error) {
    console.error(error);
    // WAJIB: Kembalikan error agar client bisa menangkapnya
    return { error: "Gagal membuat kamar baru" };
  }
}

/**
 * Memperbarui data kamar yang sudah ada.
 */
export async function updateRoom(id: string, formData: FormData) {
  const roomNumber = formData.get("roomNumber") as string;
  const price = parseInt(formData.get("price") as string);

  await prisma.room.update({
    where: { id },
    data: {
      roomNumber,
      price,
    },
  });

  revalidatePath("/dashboard/rooms");
}

/**
 * Menghapus data kamar dari database.
 */
export async function deleteRoom(id: string) {
  await prisma.room.delete({
    where: { id },
  });

  revalidatePath("/dashboard/rooms");
}
