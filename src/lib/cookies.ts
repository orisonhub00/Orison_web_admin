export function setAuthToken(token: string) {
  // 7 days expiry
  const maxAge = 60 * 60 * 24 * 7;

  document.cookie = `auth_token=${token}; path=/; max-age=${maxAge}; secure; samesite=strict`;
}

export function getAuthToken() {
  const match = document.cookie.match(/(^| )auth_token=([^;]+)/);
  return match ? match[2] : null;
}

export function clearAuthToken() {
  document.cookie = "auth_token=; path=/; max-age=0";
}
