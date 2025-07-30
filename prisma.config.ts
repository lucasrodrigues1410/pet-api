import path from "node:path";
import { defineConfig } from "prisma/config";

export default defineConfig({
	schema: path.join("prisma"),
	migrations: {
		path: path.join("prisma", "migrations"),
		seed: path.join("prisma", "seed", "index.ts"),
	},
});
