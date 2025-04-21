import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET!;
const encoder = new TextEncoder();

async function isTokenValid(token: string): Promise<boolean> {
  try {
    const { payload } = await jwtVerify(token, encoder.encode(JWT_SECRET));

    return true;
  } catch (err) {
    console.error("❌ Token invalid:", err);
    return false;
  }
}

const protectedRoutes = ["/dashboard", "/company", "/jobs", "/interview"];
const publicRoutes = ["/login", "/signup", "/"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const token = req.cookies.get("accessToken")?.value;
  const isValid = token ? await isTokenValid(token) : false;

  const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route));
  const isPublicRoute = publicRoutes.includes(path);

  // ✅ Redirect to /dashboard if authenticated user tries to access a public route
  if (isPublicRoute && token && !path.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  return NextResponse.next(); // Allow request to continue
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.(?:png|jpg|jpeg|svg|ico|webp)$).*)"],
};
