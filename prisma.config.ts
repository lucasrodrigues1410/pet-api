import path from "node:path";
import fs from "node:fs";
import { defineConfig } from "prisma/config";

// Load .env manually so `process.env.DATABASE_URL` is available when this
// config is executed by the Prisma CLI (TS/Node). This avoids undefined
// values that lead to runtime errors such as calling `startsWith` on undefined.
const dotEnvPath = path.join(process.cwd(), ".env");
if (fs.existsSync(dotEnvPath)) {
	const raw = fs.readFileSync(dotEnvPath, { encoding: "utf8" });
	raw.split(/\r?\n/).forEach((line) => {
		const m = line.match(/^\s*([A-Za-z0-9_\.\-]+)\s*=\s*(.*)\s*$/);
		if (!m) return;
		const key = m[1];
		let val = m[2] ?? "";
		if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
			val = val.slice(1, -1);
		}
		if (!process.env[key]) process.env[key] = val;
	});
}


export default defineConfig({
	schema: path.join("prisma", "models"),
	migrations: { 
		path: path.join("prisma", "migrations"),
		seed: "node ./prisma/seed/index.js",
	},
	// Prisma v7 expects datasources as an object keyed by datasource name ("db" here)
	// Move connection URL here instead of inside the schema file.
	datasource: {
		// Some Prisma internals (and older CLI helpers) still read
		// `datasource.url`. Provide it as a convenience fallback so
		// runtime checks like `datasource.url.startsWith(...)` don't
		// throw when the named datasource form is used.
		url: process.env.DATABASE_URL!,
	},
});
