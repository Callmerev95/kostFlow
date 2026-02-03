"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { RoomStatus } from "@prisma/client";

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
          startDate: new Date(),
          roomId,
        },
      });

      // 2. Update status kamar
      await tx.room.update({
        where: { id: roomId },
        data: { status: RoomStatus.OCCUPIED },
      });
    });

    // Refresh data di kedua halaman terkait
    revalidatePath("/dashboard/rooms");
    revalidatePath("/dashboard/tenants");
    revalidatePath("/dashboard");

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

/**
 * Melakukan proses check-out: Menghapus data tenant dan mengubah status kamar ke AVAILABLE.
 */
export async function checkOutTenant(tenantId: string, roomId: string) {
  try {
    await prisma.$transaction(async (tx) => {
      // 1. Hapus tenant
      await tx.tenant.delete({
        where: { id: tenantId },
      });

      // 2. Kembalikan status kamar ke AVAILABLE
      await tx.room.update({
        where: { id: roomId },
        data: { status: RoomStatus.AVAILABLE },
      });
    });

    revalidatePath("/dashboard/tenants");
    revalidatePath("/dashboard/rooms");
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Error during check-out:", error);
    return { error: "Gagal melakukan proses check-out." };
  }
}
