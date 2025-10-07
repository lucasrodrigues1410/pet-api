import multipart from "@fastify/multipart";
import { NestFactory } from "@nestjs/core";
import {
	FastifyAdapter,
	NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { cleanupOpenApiDoc } from "nestjs-zod";
import { AppModule } from "./app.module";
import { EnvService } from "./core/infra/env/env.service";

async function bootstrap() {
	//Fastify adapter
	const adapter = new FastifyAdapter();
	const app = await NestFactory.create<NestFastifyApplication>(
		AppModule,
		adapter,
		{ rawBody: true },
	);

	//App configuration
	const origins = process.env.ALLOWED_ORIGINS?.split(',') ?? [];
	app.enableCors({
		origin: origins.length ? origins : true,
		methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
		allowedHeaders: ['Content-Type', 'Authorization'],
	});
	app.register(multipart);

	//Swagger configuration
	const config = new DocumentBuilder()
		.setTitle("API de Cuidados com Animais")
		.setVersion("1.0")
		.setOpenAPIVersion("3.1.0")
		.addBearerAuth()
		.build();
	const openApiDoc = SwaggerModule.createDocument(app, config);

	SwaggerModule.setup(
		"docs",
		app,
		cleanupOpenApiDoc(openApiDoc, { version: "3.1" }),
		{ jsonDocumentUrl: "swagger/json" },
	);

	const configService = app.get(EnvService);
	const port = configService.get("PORT");

	await app.listen(port, '0.0.0.0');
}
bootstrap();
