import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
			transform: true,
		}),
	);

	const config = new DocumentBuilder()
		.setTitle("API de Cuidados com Animais")
		.setDescription("API para gerenciar serviços e informações de cuidados com animais, incluindo banho e tosa, serviços veterinários e mais")
		.setVersion("1.0")
		.build();
	const documentFactory = () => SwaggerModule.createDocument(app, config);
	SwaggerModule.setup("docs", app, documentFactory, {
		jsonDocumentUrl: "swagger/json",
	});

	await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
