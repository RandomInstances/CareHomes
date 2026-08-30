import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { currentUser } from "@/lib/member-auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const { homeId } = (await request.json().catch(() => ({}))) as { homeId?: string };
  if (!homeId) return NextResponse.json({ error: "No home given" }, { status: 400 });

  // Saving twice is not an error — the heart is a toggle and people double-tap.
  await db.favourite.upsert({
    where: { userId_homeId: { userId: user.id, homeId } },
    create: { userId: user.id, homeId },
    update: {},
  });
  return NextResponse.json({ saved: true });
}

export async function DELETE(request: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const { homeId } = (await request.json().catch(() => ({}))) as { homeId?: string };
  if (!homeId) return NextResponse.json({ error: "No home given" }, { status: 400 });

  await db.favourite.deleteMany({ where: { userId: user.id, homeId } });
  return NextResponse.json({ saved: false });
}
