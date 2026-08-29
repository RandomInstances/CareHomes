import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma";

// Prisma 7 connects through a driver adapter rather than its own engine.
// DATABASE_URL is injected by Railway as a reference to the Postgres service,
// so the credential exists only in the running container.
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL is not set. In Railway it is referenced from the Postgres service; locally it comes from .env."
  );
}

function createClient() {
  return new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
}

// Next.js hot-reloads modules in development, which would otherwise open a new
// connection pool on every edit until Postgres refuses them.
const globalForPrisma = globalThis as unknown as {
  prisma?: ReturnType<typeof createClient>;
};

export const db = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
