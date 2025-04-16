// middleware.ts
import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  // Try both cookie and Authorization header

  const token = req.cookies.get("accessToken")?.value || req.headers.get("authorization")?.split(" ")[1];
  console.log("All cookies:", req.cookies.getAll());
  console.log("Token exists:", Boolean(token));

  const { pathname } = req.nextUrl;
  const isPublic = ["/", "/login", "/forgetpassword", "/register", "/reset-password"].includes(pathname);

  if (!token && !isPublic) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  if (token && isPublic) {
    const dashboardUrl = new URL("/dashboard", req.url);
    return NextResponse.redirect(dashboardUrl);
  }

  // For API routes, ensure proper headers
  if (pathname.startsWith("/api")) {
    const response = NextResponse.next();
    response.headers.set("Access-Control-Allow-Credentials", "true");
    response.headers.set("Access-Control-Allow-Origin", "https://www.evalsy.com");
    return response;
  }

  return NextResponse.next();
}
