import { NextResponse } from "next/server";

import { destroySession } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  await destroySession();
  return NextResponse.redirect(new URL("/", request.url), { status: 303 });
}
