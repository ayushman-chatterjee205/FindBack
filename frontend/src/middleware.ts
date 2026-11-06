import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionToken = request.cookies.get("findback_session")?.value;

  // 1. Home page ('/') is always accessible without signing in!
  // Protected feature routes that require authentication:
  const protectedRoutes = [
    "/report-lost",
    "/report-found",
    "/claim",
    "/browse",
    "/my-reports",
    "/inventory",
    "/verify",
    "/handover",
    "/profile",
  ];

  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));
  if (isProtected && !sessionToken) {
    const loginUrl = new URL(`/login?redirect=${encodeURIComponent(pathname)}`, request.url);
    return NextResponse.redirect(loginUrl);
  }

  // 2. If user already has an active session and visits '/login', redirect them to '/' (home page)
  if (pathname === "/login" || pathname === "/register") {
    if (sessionToken) {
      const homeUrl = new URL("/", request.url);
      return NextResponse.redirect(homeUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, logo.png, logo.jpg, images
     */
    "/((?!api|_next/static|_next/image|favicon.ico|logo.png|logo.jpg).*)",
  ],
};
