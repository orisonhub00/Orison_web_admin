import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function protectRoutes(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  const { pathname } = request.nextUrl;

  // 1. Redirect /homepage to /
  if (pathname === "/homepage") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 2. Auth user trying to access public auth pages -> dashboard
  // 2. Auth user trying to access public auth pages -> dashboard
  // Matches "/login" (and potentially future public/auth routes) - "/" should remains public
  if (token) {
    if (pathname === "/login") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // 3. Protected Routes
  // Protects all admin routes
  const protectedPrefixes = [
    "/dashboard",
    "/students",
    "/classes",
    "/sections",
    "/academicyears",
    "/academics",
    "/teachers",
    "/attendance",
    "/subjects",
    "/timetable",
    "/staff",
    "/exams",
    "/fees",
    "/food",
  ];

  const isProtected = protectedPrefixes.some((path) =>
    pathname.startsWith(path)
  );

  if (isProtected) {
    if (!token) {
      // Redirect unauthenticated users to login
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}
