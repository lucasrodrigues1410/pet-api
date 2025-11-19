import path from "node:path";
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
	schema: path.join("prisma", "models"),
	migrations: { path: path.join("prisma", "migrations") },
	datasource: { url: env("DATABASE_URL") },
});
