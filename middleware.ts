import { NextResponse }
from "next/server";

import type {
  NextRequest,
} from "next/server";

export function middleware(
  request: NextRequest
) {
  const sid =
    request.cookies.get("sid")
      ?.value;

  const isLoginPage =
    request.nextUrl.pathname ===
    "/login";

  // No session
  if (!sid && !isLoginPage) {
    return NextResponse.redirect(
      new URL(
        "/login",
        request.url
      )
    );
  }

  // Already logged
  if (sid && isLoginPage) {
    return NextResponse.redirect(
      new URL(
        "/dashboard",
        request.url
      )
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",

    "/profile/:path*",

    "/settings/:path*",

    "/login",
  ],
};