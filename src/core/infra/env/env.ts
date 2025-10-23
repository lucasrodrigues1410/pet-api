import { z } from "zod";

export const envSchema = z.object({
	DATABASE_URL: z.string(),
	JWT_SECRET: z.string(),
	IMAGE_KIT_PUBLIC_KEY: z.string(),
	IMAGE_KIT_PRIVATE_KEY: z.string(),
	IMAGE_KIT_URL_ENDPOINT: z.string(),
	APP_URL: z.string(),
	PORT: z.coerce.number().optional().default(3333),
	GOOGLE_GENERATIVE_AI_API_KEY: z.string(),
	STRIPE_API_KEY: z.string(),
	STRIPE_WEBHOOK_SECRET: z.string(),
	CLERK_WEBHOOK_SIGNING_SECRET: z.string(),
	CLERK_SECRET_KEY: z.string(),
	REDIS_URL: z.string(),
	NOVU_SECRET_KEY: z.string(),
});

export type Env = z.infer<typeof envSchema>;
