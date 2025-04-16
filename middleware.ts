import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const cookies = req.cookies.getAll();
  console.log("🍪 Cookies from middleware:", cookies);

  const token = req.cookies.get("accessToken")?.value;
  console.log("✅ accessToken in middleware:", token);

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard"],
};
