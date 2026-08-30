import { NextResponse } from "next/server";

import { sendLoginLink } from "@/lib/member-auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    email?: string;
    name?: string;
    returnTo?: string;
    marketingOptIn?: boolean;
  };

  const email = (body.email ?? "").trim().toLowerCase();
  const name = (body.name ?? "").trim();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "That does not look like an email address." }, { status: 400 });
  }
  if (!name) {
    return NextResponse.json({ error: "Please tell us your name." }, { status: 400 });
  }

  const result = await sendLoginLink(
    email,
    name,
    body.returnTo ?? "/account",
    body.marketingOptIn === true
  );
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 502 });
  return NextResponse.json({ sent: true });
}
