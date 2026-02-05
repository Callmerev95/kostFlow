import { z } from "zod";

export const signUpSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter"),
  kostName: z.string().min(3, "Nama kos minimal 3 karakter"),
  whatsappNumber: z.string().min(10, "Nomor WhatsApp tidak valid"),
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export const loginSchema = z.object({
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(1, "Password wajib diisi"),
});
