export const formatPhoneNumber = (phone: string) => {
  let cleaned = phone.replace(/\D/g, ""); // Hapus semua karakter non-angka
  if (cleaned.startsWith("0")) {
    cleaned = "62" + cleaned.substring(1);
  }
  return cleaned;
};

export const generatePaymentMessage = (
  tenantName: string,
  kostName: string,
  amount: number,
  month: number,
  year: number,
  token: string,
) => {
  const formatIDR = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);

  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const text = `Halo Kak *${tenantName}*,\n\nKami dari *${kostName}* ingin menginfokan bahwa tagihan kost untuk periode *${months[month - 1]} ${year}* sebesar *${formatIDR}* sudah diterbitkan.\n\nKakak bisa melihat detail tagihan dan melakukan pembayaran melalui link resmi berikut:\n\n🔗 ${appUrl}/pay/${token}\n\nMohon untuk melakukan pembayaran sebelum jatuh tempo ya Kak. Terima kasih! 🙏`;

  return encodeURIComponent(text);
};
