import { z } from "zod";

export const envSchema = z.object({
	DATABASE_URL: z.string(),
	JWT_SECRET: z.string(),
	IMAGE_KIT_PUBLIC_KEY: z.string(),
	IMAGE_KIT_PRIVATE_KEY: z.string(),
	IMAGE_KIT_URL_ENDPOINT: z.string(),
	APP_URL: z.string(),
	REDIS_HOST: z.string().optional().default("127.0.0.1"),
	REDIS_PORT: z.coerce.number().optional().default(6379),
	REDIS_PASSWORD: z.string().optional(),
	PORT: z.coerce.number().optional().default(3333),
	GOOGLE_GENERATIVE_AI_API_KEY: z.string(),
	STRIPE_API_KEY: z.string(),
	STRIPE_WEBHOOK_SECRET: z.string(),
	APP_URL_FRONTEND: z.string(),
});

export type Env = z.infer<typeof envSchema>;
