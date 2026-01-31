"use server";

import { cookies } from "next/headers";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://orison-server.vercel.app";

export async function loginAction(email: string, password: string) {
  try {
    const res = await fetch(`${BASE_URL}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      return { success: false, message: data.message || "Login failed" };
    }

    // Set HttpOnly cookie for Route Protection
    (await cookies()).set("auth_token", data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    // Return data so client can set localStorage for API calls
    return { success: true, user: data.user, token: data.token };
  } catch (error: any) {
    return { success: false, message: error.message || "Something went wrong" };
  }
}
