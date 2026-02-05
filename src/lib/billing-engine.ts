import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";

export async function runBillingEngine() {
  console.log("🚀 Running Billing Engine: Checking for new bills...");

  const today = new Date();
  const currentDay = today.getDate();
  const currentMonth = today.getMonth() + 1; 
  const currentYear = today.getFullYear();

  try {
    // 1. Ambil semua tenant dan sertakan data Room untuk ambil harga (price)
    const allTenants = await prisma.tenant.findMany({
      include: {
        room: true,
      },
    });

    for (const tenant of allTenants) {
      const startDate = new Date(tenant.startDate);
      const billDay = startDate.getDate();

      // Handle akhir bulan (misal tgl 31 ketemu bulan Februari)
      const lastDayOfMonth = new Date(currentYear, currentMonth, 0).getDate();
      const actualBillDay = Math.min(billDay, lastDayOfMonth);

      // Cek apakah hari ini adalah jadwal tagihan si tenant
      if (currentDay === actualBillDay) {
        // 2. Cek apakah tagihan untuk bulan & tahun ini sudah dibuat
        const existingTransaction = await prisma.transaction.findFirst({
          where: {
            tenantId: tenant.id,
            month: currentMonth,
            year: currentYear,
          },
        });

        if (!existingTransaction) {
          console.log(
            `✨ Creating bill for: ${tenant.name} (Room ${tenant.room.roomNumber})`,
          );

          // Set Jatuh Tempo (dueDate). Misal: 3 hari setelah tagihan terbit
          const dueDate = new Date(
            currentYear,
            currentMonth - 1, 
            actualBillDay + 3, // Tambah 3 hari
          );

          await prisma.transaction.create({
            data: {
              tenantId: tenant.id,
              month: currentMonth,
              year: currentYear,
              amount: tenant.room.price, // Ambil dari model Room
              dueDate: dueDate,
              status: "PENDING",
              token: nanoid(10), 
            },
          });

          // Nanti di sini tempat pemicu WhatsApp
          console.log(`✅ Bill created successfully with token.`);
        }
      }
    }
    console.log("🏁 Billing Engine: Process finished.");
  } catch (error) {
    console.error("❌ Billing Engine Error:", error);
  }
}
