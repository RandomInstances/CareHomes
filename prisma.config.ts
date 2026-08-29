import "dotenv/config";
import { defineConfig, env } from "prisma/config";

// Prisma 7 reads the migration connection URL from here rather than from
// schema.prisma. On Railway, DATABASE_URL is injected by reference to the
// Postgres service, so no credential is ever committed.
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
