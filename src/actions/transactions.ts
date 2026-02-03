"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { TransactionStatus } from "@prisma/client";
import { createClient } from "@/lib/supabase-server";

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

/**
 * Mengupload bukti pembayaran dan memperbarui data transaksi.
 */
export async function uploadPaymentProof(
  transactionId: string,
  formData: FormData,
) {
  const file = formData.get("file") as File;
  if (!file) return { error: "File tidak ditemukan" };

  const supabase = await createClient();

  const fileExt = file.name.split(".").pop();
  const fileName = `${transactionId}-${Date.now()}.${fileExt}`; // Pakai Date.now() lebih aman dari tabrakan nama
  const filePath = `proofs/${fileName}`;

  // Perbaikan: Hapus 'uploadData' karena tidak digunakan, cukup ambil 'error'
  const { error: uploadError } = await supabase.storage
    .from("payment-proofs")
    .upload(filePath, file);

  if (uploadError) {
    console.error("Storage Error:", uploadError);
    return { error: "Gagal upload ke storage" };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("payment-proofs").getPublicUrl(filePath);

  await prisma.transaction.update({
    where: { id: transactionId },
    data: {
      paymentProof: publicUrl,
    },
  });

  revalidatePath("/dashboard/transactions");
  return { success: true };
}
