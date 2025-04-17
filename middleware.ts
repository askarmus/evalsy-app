import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/dashboard", "/company", "/jobs", "/interview"];
const publicRoutes = ["/login", "/register", "/"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const token = req.cookies.get("accessToken")?.value;

  const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route));
  const isPublicRoute = publicRoutes.includes(path);

  // ✅ Redirect to /login if trying to access a protected route without a token
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // ✅ Redirect to /dashboard if authenticated user tries to access a public route
  if (isPublicRoute && token && !path.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  return NextResponse.next(); // Allow request to continue
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.(png|jpg|jpeg|svg|ico|webp)$).*)"],
};
