import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },

  // Prisma Migrate needs a direct DB connection string
  datasource: {
    url: env("DIRECT_URL"),
  },
});