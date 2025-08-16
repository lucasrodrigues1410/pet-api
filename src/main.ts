import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { cleanupOpenApiDoc } from "nestjs-zod";
import { AppModule } from "./app.module";
import { EnvService } from "./core/infra/env/env.service";

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule, {
		rawBody: true,
		cors: true,
	});

	const openApiDoc = SwaggerModule.createDocument(
		app,
		new DocumentBuilder()
			.setTitle("API de Cuidados com Animais")
			.setDescription(
				"API para gerenciar serviços e informações de cuidados com animais",
			)
			.setVersion("1.0")
			.build(),
	);

	SwaggerModule.setup("docs", app, cleanupOpenApiDoc(openApiDoc), {
		jsonDocumentUrl: "swagger/json",
	});

	const configService = app.get(EnvService);
	const port = configService.get("PORT");

	await app.listen(port);
}
bootstrap();
