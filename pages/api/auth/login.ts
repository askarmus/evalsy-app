import type { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";

const getCookieOptions = () => {
  const isProd = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? ("none" as const) : ("lax" as const),
    path: "/",
  };
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const backendRes = await fetch("https://interview-api-production.up.railway.app/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
    });

    const data = await backendRes.json();

    if (!backendRes.ok) {
      return res.status(backendRes.status).json(data);
    }

    const { user, tokens } = data;

    if (!tokens?.accessToken || !tokens?.refreshToken) {
      return res.status(500).json({ error: "Missing tokens from backend" });
    }

    const cookieOptions = getCookieOptions();

    // ✅ Use maxAge from backend response
    res.setHeader("Set-Cookie", [
      serialize("accessToken", tokens.accessToken, {
        ...cookieOptions,
        maxAge: tokens.maxAge?.accessToken ?? 15 * 60,
      }),
      serialize("refreshToken", tokens.refreshToken, {
        ...cookieOptions,
        maxAge: tokens.maxAge?.refreshToken ?? 7 * 24 * 60 * 60,
      }),
    ]);

    return res.status(200).json({ user });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Login failed" });
  }
}
