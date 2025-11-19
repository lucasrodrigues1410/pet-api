import path from "node:path";
import { defineConfig, env } from "prisma/config";
import "dotenv/config";

export default defineConfig({
	schema: path.join("prisma", "models"),
	migrations: { path: path.join("prisma", "migrations") },
	datasource: { url: env("process.env.DATABASE_URL") },
});
