import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const PROTECTED_ROUTES = [
  "/sarathi/life-report",
  "/sarathi/chat",
  "/sarathi/data-engine",
  "/sarathi/consultation",
];

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  let response = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
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
    }
  );

  /*
   * This refreshes and validates the Supabase session.
   * Do not place unrelated code between createServerClient()
   * and this call.
   */
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute && !user) {
    const loginUrl = new URL(
      "/sarathi/individual/login",
      request.url
    );

    loginUrl.searchParams.set(
      "next",
      pathname + (search || "")
    );

    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Run on normal application pages, but skip static files,
     * images and common metadata files.
     */
    "/((?!_next/static|_next/image|favicon.ico|sw.js|manifest.webmanifest|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};