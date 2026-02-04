"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateSettings(userId: string, formData: FormData) {
  try {
    const bankName = formData.get("bankName") as string;
    const accountNumber = formData.get("accountNumber") as string;
    const accountName = formData.get("accountName") as string;

    // Update data user di database
    await prisma.user.update({
      where: { id: userId },
      data: {
        bankName,
        accountNumber,
        accountName,
      },
    });

    // Beritahu Next.js untuk memperbarui tampilan yang menggunakan data ini
    revalidatePath("/dashboard/settings");
    revalidatePath("/pay"); // Revalidate semua halaman di bawah /pay juga

    return { success: true };
  } catch (error) {
    console.error("FAILED_TO_UPDATE_SETTINGS:", error);
    return { error: "Gagal memperbarui pengaturan. Silakan coba lagi." };
  }
}
