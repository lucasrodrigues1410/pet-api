import path from "node:path";
import { defineConfig, env } from "prisma/config";
import "dotenv/config";

export default defineConfig({
	engine: "classic",
	datasource: { url: env("DATABASE_URL") },
	schema: path.join("prisma", "models"),
	migrations: { path: path.join("prisma", "migrations") },
});
