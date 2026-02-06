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

  const phoneRegex = /^(08|628)[0-9]{8,12}$/;

  if (!phoneRegex.test(phoneNumber)) {
    return {
      error: "Format Nomor Hp Salah!",
      description:
        "Nomor harus diawali dengan 08 atau 628 dan minimal 10 digit.",
    };
  }

  if (!roomId) {
    return { error: "ID Kamar tidak ditemukan" };
  }

  try {
    await prisma.$transaction(async (tx) => {
      const newTenant = await tx.tenant.create({
        data: {
          name,
          phoneNumber,
          startDate: new Date(),
          roomId,
          userId: authUser.id,
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
    console.error("Error:", error);
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
      await tx.transaction.deleteMany({
        where: { tenantId: tenantId },
      });

      await tx.tenant.delete({
        where: { id: tenantId },
      });

      await tx.room.update({
        where: { id: roomId },
        data: { status: RoomStatus.AVAILABLE },
      });
    });

    revalidatePath("/dashboard/tenants");
    revalidatePath("/dashboard/rooms");
    revalidatePath("/dashboard/transactions");
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Error during check-out:", error);
    return { error: "Gagal melakukan proses check-out." };
  }
}

/**
 * Update data penyewa (Nama & Nomor HP).
 */
export async function updateTenant(
  id: string,
  data: { name: string; phoneNumber: string },
) {
  // Validasi format nomor HP kembali untuk keamanan data
  const phoneRegex = /^(08|628)[0-9]{8,12}$/;

  if (!phoneRegex.test(data.phoneNumber)) {
    return {
      error: "Format Nomor Hp Salah!",
      description:
        "Nomor harus diawali dengan 08 atau 628 dan minimal 10 digit.",
    };
  }

  try {
    const updated = await prisma.tenant.update({
      where: { id },
      data: {
        name: data.name,
        phoneNumber: data.phoneNumber,
        updatedAt: new Date(), // Sesuai instruksi: selalu update field updatedAt
      },
    });

    // Revalidate agar tabel di dashboard langsung berubah
    revalidatePath("/dashboard/tenants");

    return { success: true, data: updated };
  } catch (error) {
    console.error("Update Tenant Error:", error);
    return { error: "Gagal memperbarui data penyewa." };
  }
}
