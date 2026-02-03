"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { TransactionStatus } from "@prisma/client";

/**
 * Mengonfirmasi pembayaran transaksi secara manual oleh owner.
 */
export async function confirmPayment(transactionId: string) {
  try {
    await prisma.transaction.update({
      where: { id: transactionId },
      data: {
        status: TransactionStatus.PAID,
        paidAt: new Date(),
      },
    });

    revalidatePath("/dashboard/transactions");
    revalidatePath("/dashboard"); // Agar overview angka ikut update (kalau ada card pendapatan)

    return { success: true };
  } catch (error) {
    console.error("Error confirming payment:", error);
    return { error: "Gagal mengonfirmasi pembayaran." };
  }
}
