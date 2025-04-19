import { patchNestjsSwagger } from "@anatine/zod-nestjs";
import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { EnvService } from "./core/infra/env/env.service";

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule, {
		rawBody: true,
	});

	const config = new DocumentBuilder()
		.setTitle("API de Cuidados com Animais")
		.setDescription(
			"API para gerenciar serviços e informações de cuidados com animais, incluindo banho e tosa, serviços veterinários e mais",
		)
		.setVersion("1.0")
		.build();
	patchNestjsSwagger();

	const documentFactory = () => SwaggerModule.createDocument(app, config);
	SwaggerModule.setup("docs", app, documentFactory, {
		jsonDocumentUrl: "swagger/json",
	});

	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
			transformOptions: { enableImplicitConversion: true },
		}),
	);

	const configService = app.get(EnvService);
	const port = configService.get("PORT");

	await app.listen(port);
}
bootstrap();
