import { NextResponse } from "next/server";

export function middleware() {
  return NextResponse.next();
}

// Only match paths that don't exist to avoid any issues
export const config = {
  matcher: [],
};
