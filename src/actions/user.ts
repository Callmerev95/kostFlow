"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase-server";

export async function updateSettings(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  if (!authUser) return { error: "Unauthorized" };

  try {
    const bankName = formData.get("bankName") as string;
    const accountNumber = formData.get("accountNumber") as string;
    const accountName = formData.get("accountName") as string;
    const ewalletName = formData.get("ewalletName") as string | null;
    const ewalletNumber = formData.get("ewalletNumber") as string | null;
    const qrisFile = formData.get("qrisFile") as File;

    let qrisUrl = formData.get("currentQrisUrl") as string | null;

    // Logic Upload ke Supabase Storage jika ada file baru
    if (qrisFile && qrisFile.size > 0) {
      const fileExt = qrisFile.name.split(".").pop();
      const fileName = `${authUser.id}-${Date.now()}.${fileExt}`;
      const filePath = `qris/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("payment-proofs")
        .upload(filePath, qrisFile);

      if (uploadError) throw new Error("Gagal mengunggah gambar QRIS.");

      const {
        data: { publicUrl },
      } = supabase.storage.from("payment-proofs").getPublicUrl(filePath);

      qrisUrl = publicUrl;
    }

    await prisma.user.update({
      where: { id: authUser.id },
      data: {
        bankName: bankName || null,
        accountNumber: accountNumber || null,
        accountName: accountName || null,
        ewalletName: ewalletName || null,
        ewalletNumber: ewalletNumber || null,
        qrisImage: qrisUrl || null,
        updatedAt: new Date(), // Pastikan field updatedAt tercatat
      },
    });

    revalidatePath("/dashboard/settings");
    revalidatePath("/pay/[token]", "page");

    return { success: true };
  } catch (error) {
    console.error("FAILED_TO_UPDATE_SETTINGS:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Gagal memperbarui pengaturan. Silakan coba lagi.";

    return { error: errorMessage };
  }
}
