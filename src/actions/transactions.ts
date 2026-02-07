"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { TransactionStatus } from "@prisma/client";
import { createClient } from "@/lib/supabase-server";
import { sendNotification } from "@/lib/send-push";

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
 * Sekaligus mengirim push notification ke Owner kost.
 */
export async function uploadPaymentProof(
  transactionId: string,
  formData: FormData,
) {
  try {
    const file = formData.get("file") as File;
    if (!file) return { error: "File tidak ditemukan" };

    const supabase = await createClient();

    // 1. Persiapan File Upload
    const fileExt = file.name.split(".").pop();
    const fileName = `${transactionId}-${Date.now()}.${fileExt}`;
    const filePath = `proofs/${fileName}`;

    // 2. Upload ke Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("payment-proofs")
      .upload(filePath, file);

    if (uploadError) {
      console.error("Storage Error:", uploadError);
      return { error: "Gagal upload ke storage" };
    }

    // 3. Ambil URL Publik
    const {
      data: { publicUrl },
    } = supabase.storage.from("payment-proofs").getPublicUrl(filePath);

    // 4. Update Database Prisma & Ambil Relasi Owner/Room
    const updatedTransaction = await prisma.transaction.update({
      where: { id: transactionId },
      data: {
        paymentProof: publicUrl,
        updatedAt: new Date(),
      },
      include: {
        tenant: {
          include: {
            user: true, // Data Owner Kost
            room: true, // Data Nomor Kamar
          },
        },
      },
    });

    // 5. TRIGGER NOTIFIKASI (Non-blocking)
    const owner = updatedTransaction.tenant.user;
    const roomNumber = updatedTransaction.tenant.room.roomNumber;
    const tenantName = updatedTransaction.tenant.name;

    if (owner.pushSubscription) {
      // Kita panggil tanpa 'await' agar user penyewa tidak menunggu proses kirim notif
      sendNotification(
        owner.pushSubscription,
        "Pembayaran Baru! 💰",
        `${tenantName} (Kamar ${roomNumber}) baru saja mengunggah bukti pembayaran.`,
      ).catch((err: Error) => {
        console.error("Gagal mengirim notifikasi push:", err.message);
      });
    }

    // 6. Real-time Broadcast ke Dashboard (Opsional jika ingin update tanpa refresh)
    await supabase.channel(`pay-${updatedTransaction.token}`).send({
      type: "broadcast",
      event: "proof-uploaded",
      payload: { message: "Bukti pembayaran telah diunggah" },
    });

    // 7. Revalidate Cache Next.js
    revalidatePath("/dashboard/transactions");
    revalidatePath(`/pay/${updatedTransaction.token}`, "page");

    return { success: true };
  } catch (error) {
    console.error("Error in uploadPaymentProof:", error);
    return { error: "Terjadi kesalahan saat memproses bukti pembayaran." };
  }
}
