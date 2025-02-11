import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("userAuth")?.value;

  if (!token && pathname === "/") {
    return;
  }

  // If the user is NOT logged in and trying to access protected pages, redirect to login
  if (!token && !["/login", "/register"].includes(pathname)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If the user IS logged in and tries to access login or register, redirect to "/jobs/list"
  if (token && ["/login", "/register"].includes(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // If the user is logged in and visiting the root "/", redirect to "/jobs/list"
  if (token && pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Allow the request to proceed if none of the above conditions are met
  return NextResponse.next();
}

// Ensure the middleware only applies to necessary paths
export const config = {
  matcher: ["/", "/jobs/:path*", "/login", "/dashboard", "/register", "/company/:path", "/company/:path"],
};
