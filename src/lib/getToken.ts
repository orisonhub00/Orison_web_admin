// src/utils/getToken.ts

const TOKEN_KEY = "orison_admin_token";

export function setAdminToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, token);
  }
}

export function getAdminToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
}

export function removeAdminToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
  }
}
