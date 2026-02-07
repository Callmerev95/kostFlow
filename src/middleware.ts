import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const url = new URL(request.url);

  // OPTIMASI: Langsung bypass jika request adalah untuk file statis PWA
  // Ini mencegah overhead eksekusi auth pada file publik
  if (
    url.pathname === "/sw.js" ||
    url.pathname === "/worker-push.js" ||
    url.pathname.startsWith("/icons/") ||
    url.pathname === "/manifest.json"
  ) {
    return NextResponse.next();
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({
            request: { headers: request.headers },
          });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: "", ...options });
          response = NextResponse.next({
            request: { headers: request.headers },
          });
          response.cookies.set({ name, value: "", ...options });
        },
      },
    },
  );

  // Menggunakan getUser() adalah standar keamanan (server-side validation)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 1. PROTEKSI REVERSE: Jika sudah login, jangan boleh ke /login, /register, atau /forgot-password
  const authPages = ["/login", "/register", "/forgot-password"];
  if (user && authPages.includes(url.pathname)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 2. PROTEKSI DASHBOARD: Jika belum login, tendang ke /login
  if (!user && url.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 3. PROTEKSI UPDATE PASSWORD: Jangan boleh akses /update-password tanpa session/link valid
  if (!user && url.pathname.startsWith("/update-password")) {
    return NextResponse.redirect(
      new URL("/login?error=Sesi kadaluarsa", request.url),
    );
  }

  return response;
}

export const config = {
  /*
   * Matcher ini menggunakan pola Regex Negatif untuk mengecualikan:
   * - api (API routes)
   * - _next/static (static files)
   * - _next/image (image optimization files)
   * - favicon.ico, manifest.json, sw.js, worker-push.js (PWA & metadata)
   * - icons (folder icon PWA)
   */
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|manifest.json|sw.js|worker-push.js|icons).*)",
  ],
};
