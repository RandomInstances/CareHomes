import { NextResponse } from "next/server";

import { consumeLoginLink } from "@/lib/member-auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const token = params.get("token");
  const returnTo = params.get("returnTo") ?? "/account";

  if (!token) return NextResponse.redirect(new URL("/signin?error=missing-link", request.url));

  const result = await consumeLoginLink(token);
  if (!result.ok) {
    return NextResponse.redirect(
      new URL(`/signin?error=${encodeURIComponent(result.error)}`, request.url)
    );
  }
  return NextResponse.redirect(new URL(returnTo, request.url));
}
