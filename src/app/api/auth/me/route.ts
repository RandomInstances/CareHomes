import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { currentUser } from "@/lib/member-auth";

// The heart needs to know, on any page, whether someone is signed in and what
// they have already saved.
export const dynamic = "force-dynamic";

export async function GET() {
  const user = await currentUser();
  if (!user) return NextResponse.json({ signedIn: false, favourites: [] });

  const favourites = await db.favourite.findMany({
    where: { userId: user.id },
    select: { homeId: true },
  });

  return NextResponse.json({
    signedIn: true,
    name: user.name,
    favourites: favourites.map((f) => f.homeId),
  });
}
