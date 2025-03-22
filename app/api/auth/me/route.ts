export const runtime = "nodejs";

import { COOKIE_NAME } from "@/constant";
import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();

  const secret = process.env.JWT_SECRET || "";
  console.log("secret", secret);
  console.log("cookieStore", cookieStore);
  const token = cookieStore.get(COOKIE_NAME);

  console.log("📦 Incoming Cookies:");
  cookieStore.getAll().forEach((cookie) => {
    console.log(`🔑 ${cookie.name} = ${cookie.value}`);
  });

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { value } = token;

  try {
    const decoded = verify(value, secret) as { name: string; email: string; id: string };

    const response = {
      name: decoded.name,
      email: decoded.email,
    };

    return new Response(JSON.stringify(response), { status: 200 });
  } catch (e) {
    return NextResponse.json({ message: "Something went wrong" }, { status: 400 });
  }
}
