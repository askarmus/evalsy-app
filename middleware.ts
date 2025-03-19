import { NextRequest, NextResponse } from "next/server";
import { parse } from "cookie";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // console.log("🔍 Request Headers:", request.headers);

  // const cookieHeader = request.headers.get("cookie") || "";
  // console.log("🍪 Raw Cookie Header:", cookieHeader); // ✅ Debugging line

  // const cookies = parse(cookieHeader);
  // console.log("🍪 Parsed Cookies:", cookies); // ✅ Debugging line

  // const token = cookies.accessToken || null;
  // console.log("🔑 Extracted Token:", token); // ✅ Debugging line

  // if (!token && !["/login", "/register"].includes(pathname)) {
  //   return NextResponse.redirect(new URL("/login", request.url));
  // }

  // if (token && ["/login", "/register"].includes(pathname)) {
  //   return NextResponse.redirect(new URL("/dashboard", request.url));
  // }

  return NextResponse.next();
}

// ✅ Ensure the middleware only applies to necessary paths
export const config = {
  matcher: ["/", "/jobs/:path*", "/login", "/dashboard", "/register", "/company/:path*"],
};
