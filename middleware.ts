import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_URL, isAdminMode } from "@/lib/app-urls";

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (isAdminMode) {
    if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
      return NextResponse.next();
    }

    return NextResponse.redirect(new URL("/admin", request.url));
  }

  if (pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL(`${pathname}${search}`, ADMIN_URL));
  }

  if (pathname.startsWith("/api/admin")) {
    return new NextResponse(null, { status: 404 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.png|img/|robots.txt|sitemap.xml).*)",
  ],
};
