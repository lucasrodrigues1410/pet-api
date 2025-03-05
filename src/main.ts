import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { patchNestJsSwagger } from "nestjs-zod";
import { AppModule } from "./app.module";

patchNestJsSwagger();

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	const config = new DocumentBuilder()
		.setTitle("API de Cuidados com Animais")
		.setDescription(
			"API para gerenciar serviços e informações de cuidados com animais, incluindo banho e tosa, serviços veterinários e mais",
		)
		.setVersion("1.0")
		.build();
	const documentFactory = () => SwaggerModule.createDocument(app, config);
	SwaggerModule.setup("docs", app, documentFactory, {
		jsonDocumentUrl: "swagger/json",
	});

	await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
