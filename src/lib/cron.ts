import cron from "node-cron";
import { runBillingEngine } from "./billing-engine";

// Jalankan setiap hari jam 00:00 (Tengah Malam)
// Format: minute hour day-of-month month day-of-week
export const initCronJobs = () => {
  cron.schedule("0 0 * * *", async () => {
    await runBillingEngine();
  });

  console.log(
    "⏰ Cron Jobs Initialized: Billing Engine will run at 00:00 every day.",
  );
};
