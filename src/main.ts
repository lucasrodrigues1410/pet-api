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
	const app = await NestFactory.create<NestFastifyApplication>(
		AppModule,
		new FastifyAdapter(),
		{ rawBody: true, cors: true },
	);

	const openApiDoc = SwaggerModule.createDocument(
		app,
		new DocumentBuilder()
			.setTitle("API de Cuidados com Animais")
			.setDescription(
				"API para gerenciar serviços e informações de cuidados com animais",
			)
			.setVersion("1.0")
			.setOpenAPIVersion("3.1.0")
			.build(),
	);

	SwaggerModule.setup(
		"docs",
		app,
		cleanupOpenApiDoc(openApiDoc, { version: "3.1" }),
		{ jsonDocumentUrl: "swagger/json" },
	);

	const configService = app.get(EnvService);
	const port = configService.get("PORT");

	await app.listen(port);
}
bootstrap();
