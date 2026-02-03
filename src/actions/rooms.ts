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
}
