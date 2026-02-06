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
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
      select: { token: true },
    });

    if (!transaction) return { error: "Transaksi tidak ditemukan" };

    await prisma.transaction.update({
      where: { id: transactionId },
      data: {
        status: TransactionStatus.PAID,
        paidAt: new Date(),
        updatedAt: new Date(),
      },
    });

    const supabaseServer = await createClient();
    await supabaseServer.channel(`pay-${transaction.token}`).send({
      type: "broadcast",
      event: "payment-success",
      payload: { message: "LUNAS" },
    });

    revalidatePath("/dashboard/transactions");
    revalidatePath("/dashboard");
    revalidatePath(`/pay/${transaction.token}`, "page");

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
  const fileName = `${transactionId}-${Date.now()}.${fileExt}`;
  const filePath = `proofs/${fileName}`;

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

  const updatedTransaction = await prisma.transaction.update({
    where: { id: transactionId },
    data: {
      paymentProof: publicUrl,
      updatedAt: new Date(),
    },
  });

  // Revalidate Dashboard & Halaman Publik
  revalidatePath("/dashboard/transactions");
  revalidatePath(`/pay/${updatedTransaction.token}`, "page");

  return { success: true };
}
