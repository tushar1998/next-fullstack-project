import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { env } from "@/lib/env.mjs";

const [AUTH_USER, AUTH_PASS] = env.HTTP_BASIC_AUTH.split(":");

// Step 1. Check HTTP Basic Auth header if present
function isAuthenticated(req: NextRequest) {
  const authheader = req.headers.get("authorization") || req.headers.get("Authorization");

  if (!authheader) {
    return false;
  }

  const [user, pass] = Buffer.from(authheader.split(" ")[1], "base64").toString().split(":");

  if (user === AUTH_USER && pass === AUTH_PASS) {
    return true;
  }
  return false;
}

// Step 2. HTTP Basic Auth Middleware for Challenge
export function middleware(req: NextRequest) {
  if (!isAuthenticated(req)) {
    return NextResponse.json(
      { status: 401, message: "SuperAdmin: Authentication Required" },
      {
        status: 401,
        headers: { "WWW-Authenticate": "Basic" },
      }
    );
  }

  return NextResponse.next();
}

// Step 3. Configure "Matching Paths" below to protect routes with HTTP Basic Auth
export const config = {
  matcher: "/superadmin/:path*",
};
