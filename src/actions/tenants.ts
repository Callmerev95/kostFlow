"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { RoomStatus } from "@prisma/client";
import { createClient } from "@/lib/supabase-server";

/**
 * Mencatat penghuni baru, update status kamar, dan BUAT TAGIHAN OTOMATIS.
 */
export async function createTenant(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) {
    return { error: "Unauthorized" };
  }

  const name = formData.get("name") as string;
  const phoneNumber = formData.get("phoneNumber") as string;
  const price = parseInt(formData.get("price") as string);
  const roomId = formData.get("roomId") as string;

  const now = new Date();

  try {
    await prisma.$transaction(async (tx) => {
      // 2. Simpan data penghuni baru (WAJIB sertakan userId)
      const newTenant = await tx.tenant.create({
        data: {
          name,
          phoneNumber,
          startDate: new Date(),
          roomId,
          userId: authUser.id, // FIX: TypeScript tidak akan protes lagi
        },
      });

      // 3. Update status kamar
      await tx.room.update({
        where: { id: roomId },
        data: { status: RoomStatus.OCCUPIED },
      });

      // 4. Buat Tagihan Otomatis untuk bulan pertama
      await tx.transaction.create({
        data: {
          tenantId: newTenant.id,
          amount: price,
          month: now.getMonth() + 1,
          year: now.getFullYear(),
          status: "PENDING",
          // Jatuh tempo tanggal 10 bulan berjalan
          dueDate: new Date(now.getFullYear(), now.getMonth(), 10),
        },
      });
    });

    // Refresh semua halaman terkait
    revalidatePath("/dashboard/transactions");
    revalidatePath("/dashboard/rooms");
    revalidatePath("/dashboard/tenants");
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Error creating tenant & transaction:", error);
    return { error: "Gagal memproses check-in dan tagihan." };
  }
}

/**
 * Mengambil daftar penghuni milik owner yang sedang login.
 */
export async function getTenants(userId: string) {
  return await prisma.tenant.findMany({
    where: {
      userId: userId, // Sekarang bisa langsung begini, lebih efisien!
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
 * Proses check-out: Hapus data tenant dan kembalikan status kamar.
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
