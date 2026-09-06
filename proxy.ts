import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { cancelTabExit } from "@/lib/supabase/admin-session";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return response;
  }

  try {
    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },

        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          response = NextResponse.next({
            request,
          });

          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
    const isLoginPage = request.nextUrl.pathname === "/admin/login";

    if (isAdminRoute && !isLoginPage && user) {
      // Admin is active or refreshed an admin page; cancel any scheduled tab exit
      cancelTabExit();
    }

    if (isAdminRoute && !isLoginPage && !user) {
      const url = request.nextUrl.clone();

      url.pathname = "/admin/login";
      url.searchParams.set("redirect", request.nextUrl.pathname);

      return NextResponse.redirect(url);
    }

    if (isLoginPage && user) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  } catch (err) {
    console.error("Proxy error:", err);
  }

  return response;
}

export const config = {
  matcher: [
    "/admin",
    "/admin/:path*",
  ],
};