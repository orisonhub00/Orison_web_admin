const BASE_URL = "https://orison-server.vercel.app";

export async function adminLogin(email: string, password: string) {
  console.log("📡 Calling Login API...");
  console.log("➡️ Request payload:", { email, password });

  const res = await fetch(`${BASE_URL}/api/v1/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  console.log("📥 Raw response status:", res.status);

  const data = await res.json();
  console.log("📥 API response data:", data);

  if (!res.ok || !data.success) {
    console.error("❌ Login API error:", data.message || "Login failed");
    throw new Error(data.message || "Login failed");
  }

  console.log("✅ Login API success");
  return data;
}
