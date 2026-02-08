import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const url = new URL(request.url);

  // 1. FAST BYPASS: Cek statis duluan biar nggak makan CPU
  if (
    url.pathname === "/sw.js" ||
    url.pathname === "/worker-push.js" ||
    url.pathname === "/manifest.json" ||
    url.pathname.startsWith("/icons/") ||
    url.pathname.startsWith("/_next/") ||
    url.pathname.endsWith(".ico")
  ) {
    return NextResponse.next();
  }

  // Buat response awal
  const response = NextResponse.next({
    request: { headers: request.headers },
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
          // Update cookie di request agar getUser() dapet data terbaru
          request.cookies.set({ name, value, ...options });
          // Update cookie di response agar tersimpan di browser
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: "", ...options });
          response.cookies.set({ name, value: "", ...options });
        },
      },
    },
  );

  // Validasi user secara efisien
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Logic Proteksi Halaman
  const isAuthPage = ["/login", "/register", "/forgot-password"].includes(
    url.pathname,
  );
  const isDashboardPage = url.pathname.startsWith("/dashboard");
  const isUpdatePasswordPage = url.pathname.startsWith("/update-password");

  if (user && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (!user && (isDashboardPage || isUpdatePasswordPage)) {
    const redirectUrl = new URL("/login", request.url);
    if (isUpdatePasswordPage)
      redirectUrl.searchParams.set("error", "Sesi kadaluarsa");
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|manifest.json|sw.js|worker-push.js|icons).*)",
  ],
};
