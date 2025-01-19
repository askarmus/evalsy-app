import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("userAuth")?.value;

  // Redirect "/" to "/jobs/list" if the user is logged in
  if (token && pathname === "/") {
    return NextResponse.redirect(new URL("/jobs/list", request.url));
  }

  if (!token && pathname === "/") {
    return;
  }

  // Redirect "/login" or "/register" to "/" if the user is logged in
  if ((pathname === "/login" || pathname === "/register") && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Redirect any path (except "/login" or "/register") to "/login" if the user is not logged in
  if (!token && pathname !== "/login" && pathname !== "/register") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Allow the request to proceed if none of the above conditions are met
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/jobs", "/login", "/register"], // Define the paths to match
};
