"use server";

import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { signUpSchema } from "@/lib/zod";
import { revalidatePath } from "next/cache";

/**
 * Helper internal untuk inisialisasi Supabase Server Client
 * agar kode tetap DRY (Don't Repeat Yourself)
 */
async function getSupabaseClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: "", ...options });
        },
      },
    },
  );
}

/**
 * Registrasi User Baru: Supabase Auth + Prisma Profile Sync
 */
export async function signUp(formData: FormData) {
  const rawData = Object.fromEntries(formData.entries());

  // 1. Validasi Input dengan Zod
  const validatedFields = signUpSchema.safeParse(rawData);
  if (!validatedFields.success) {
    return {
      error: "Validasi gagal",
      details: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password, name, kostName, whatsappNumber } =
    validatedFields.data;
  const supabase = await getSupabaseClient();

  // 2. Daftar ke Supabase Auth
  const { data, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: name }, // Metadata cadangan di Supabase
    },
  });

  if (authError) {
    return { error: authError.message };
  }

  // 3. Jika Auth sukses, sinkronkan profil ke Prisma
  if (data.user) {
    try {
      await prisma.user.create({
        data: {
          id: data.user.id, // Sinkronkan ID Supabase ke Prisma
          email,
          password: "", // Password dikelola aman oleh Supabase
          name,
          kostName,
          whatsappNumber,
          // createdAt & updatedAt otomatis di-handle Prisma sesuai schema
        },
      });

      return {
        success: true,
        message:
          "Registrasi berhasil! Silakan cek email Anda untuk verifikasi.",
      };
    } catch (dbError) {
      console.error("Prisma Sync Error:", dbError);
      return { error: "Gagal menyinkronkan data profil ke database." };
    }
  }

  return { error: "Terjadi kesalahan yang tidak diketahui." };
}

/**
 * Login User: Supabase Password Authentication
 */
export async function signIn(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email dan password wajib diisi." };
  }

  const supabase = await getSupabaseClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  // Jika login berhasil, kita beri sinyal sukses ke client
  // Client-side yang akan menangani redirect ke dashboard agar Toast sempat muncul
  revalidatePath("/", "layout");
  return {
    success: true,
    message: "Akses diberikan. Selamat datang di KostFlow!",
  };
}

/**
 * Logout User
 */
export async function signOut() {
  const supabase = await getSupabaseClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  return { success: true };
}

/**
 * Reset Password: Kirim email instruksi via Supabase
 */
export async function resetPassword(formData: FormData) {
  const email = formData.get("email") as string;
  const supabase = await getSupabaseClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    // URL ini nanti akan kita buat untuk halaman input password baru
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/update-password`,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

/**
 * Update Password: Mengubah password user yang sedang dalam sesi reset
 */
export async function updatePassword(formData: FormData) {
  const password = formData.get("password") as string;
  const supabase = await getSupabaseClient();

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}
