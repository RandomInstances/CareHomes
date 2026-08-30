import { NextResponse } from "next/server";

import { googleConfigured, startGoogleSignIn } from "@/lib/member-auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!googleConfigured()) {
    return NextResponse.redirect(new URL("/signin?error=google-unavailable", request.url));
  }
  const returnTo = new URL(request.url).searchParams.get("returnTo") ?? "/account";
  return NextResponse.redirect(await startGoogleSignIn(returnTo));
}
