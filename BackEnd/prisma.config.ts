// This file is used by the Prisma CLI (for migrations, studio, etc.)
// It is NOT imported at runtime by the app — see src/config/prisma.config.js for that.
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "src/prisma/schema.prisma",
  migrations: {
    path: "src/prisma/migrations",
  },
  datasource: {
    url: process.env["DIRECT_URL"],
  },
});
