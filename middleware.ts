import { NextRequest, NextResponse } from "next/server";
import { parse } from "cookie";
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  console.log("🔍 Request Headers:", request.headers);

  const cookieHeader = request.headers.get("cookie") || "";
  const cookies = parse(cookieHeader);

  const token = cookies.accessToken || null;

  console.log("Extracted Token from Middleware:", token);

  // ✅ If the user is NOT logged in and trying to access protected pages, redirect to login
  if (!token && !["/login", "/register"].includes(pathname)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // ✅ If the user IS logged in and tries to access login or register, redirect to "/dashboard"
  if (token && ["/login", "/register"].includes(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // ✅ If the user is logged in and visiting the root "/", redirect to "/dashboard"
  if (token && pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // ✅ Allow the request to proceed if none of the above conditions are met
  return NextResponse.next();
}

// ✅ Ensure the middleware only applies to necessary paths
export const config = {
  matcher: ["/", "/jobs/:path*", "/login", "/dashboard", "/register", "/company/:path*"],
};
