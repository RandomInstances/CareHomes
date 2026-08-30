import { NextResponse } from "next/server";

import { completeGoogleSignIn } from "@/lib/member-auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const code = params.get("code");
  const state = params.get("state");

  if (!code || !state) {
    return NextResponse.redirect(new URL("/signin?error=cancelled", request.url));
  }

  const result = await completeGoogleSignIn(code, state);
  if (!result.ok) {
    return NextResponse.redirect(
      new URL(`/signin?error=${encodeURIComponent(result.error)}`, request.url)
    );
  }
  return NextResponse.redirect(new URL(result.returnTo, request.url));
}
