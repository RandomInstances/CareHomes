import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// Railway polls this before switching traffic to a new deployment, and it is
// the endpoint an uptime monitor should watch. It reports database
// reachability and how many migrations have been applied — deliberately no
// schema detail, since this is publicly reachable.
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const rows = await db.$queryRaw<
      { count: number }[]
    >`SELECT COUNT(*)::int AS count FROM _prisma_migrations WHERE finished_at IS NOT NULL`;

    return NextResponse.json({
      ok: true,
      database: "connected",
      migrationsApplied: rows[0]?.count ?? 0,
    });
  } catch (error) {
    // A missing _prisma_migrations table means the database is reachable but
    // migrations have not run — worth distinguishing from being unreachable.
    const message = error instanceof Error ? error.message : String(error);
    const migrationsMissing = /_prisma_migrations/i.test(message);

    return NextResponse.json(
      {
        ok: false,
        database: migrationsMissing ? "connected" : "unreachable",
        migrationsApplied: migrationsMissing ? 0 : null,
      },
      { status: 503 }
    );
  }
}
