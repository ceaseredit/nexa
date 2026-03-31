import { NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const adminCookie = req.cookies.get("admin");
  const userCookie = req.cookies.get("user");

  const isAdminRoute = pathname.startsWith("/admin");
  const isAdminAuth =
    pathname === "/admin/signin" || pathname === "/admin/signup";
  const isUserRoute = pathname.startsWith("/dashboard");
  const isUserAuth = pathname === "/signin" || pathname === "/signup";

  // ── Admin routes ──
  if (isAdminRoute && !isAdminAuth && !adminCookie) {
    return NextResponse.redirect(new URL("/admin/signin", req.url));
  }
  if (isAdminAuth && adminCookie) {
    return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  }

  // ── User routes ──
  if (isUserRoute && !userCookie) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  // ── User auth pages — redirect away if already logged in ──
  if (isUserAuth && userCookie) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // ── Prevent a user cookie from accessing admin routes ──
  if (isAdminRoute && !isAdminAuth && userCookie && !adminCookie) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/signin", "/signup"],
};
