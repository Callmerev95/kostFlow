"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * Mencatat penghuni baru dan mengubah status kamar menjadi OCCUPIED.
 * Menggunakan transaksi database untuk menjamin konsistensi data.
 */
export async function createTenant(formData: FormData, roomId: string) {
  const name = formData.get("name") as string;
  const phoneNumber = formData.get("phoneNumber") as string;

  try {
    await prisma.$transaction(async (tx) => {
      // 1. Simpan data penghuni baru
      await tx.tenant.create({
        data: {
          name,
          phoneNumber,
          startDate: new Date(), // Default tanggal hari ini
          roomId,
        },
      });

      // 2. Update status kamar terkait menjadi TERISI
      await tx.room.update({
        where: { id: roomId },
        data: { status: "OCCUPIED" },
      });
    });

    // Refresh data di kedua halaman terkait
    revalidatePath("/dashboard/rooms");
    revalidatePath("/dashboard/page");

    return { success: true };
  } catch (error) {
    console.error("Error creating tenant:", error);
    return { error: "Gagal menambahkan penghuni." };
  }
}

/**
 * Mengambil semua daftar penghuni yang aktif.
 * Menggunakan 'include' untuk join data dengan tabel Room.
 */
export async function getTenants(userId: string) {
  return await prisma.tenant.findMany({
    where: {
      room: {
        userId: userId,
      },
    },
    include: {
      room: true,
    },
    orderBy: {
      startDate: "desc", 
    },
  });
}
