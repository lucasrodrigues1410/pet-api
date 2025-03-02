import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ValidationPipe } from "@nestjs/common";
import { InvalidCredentialsErrorFilter } from "./modules/auth/filters/invalid-credentials-error.filter";
import { NotFoundErrorFilter } from "./common/filters/not-found-exception.filter";
import { ValidationExceptionFilter } from "./common/filters/validation-exception.filter";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true, 
			forbidNonWhitelisted: true, 
			transform: true 
		}),
	);

	app.useGlobalFilters(
		new ValidationExceptionFilter(),
		new InvalidCredentialsErrorFilter(),
		new NotFoundErrorFilter(),
	);
	
	const config = new DocumentBuilder()
		.setTitle("Cats example")
		.setDescription("The cats API description")
		.setVersion("1.0")
		.build();
	const documentFactory = () => SwaggerModule.createDocument(app, config);
	SwaggerModule.setup("swagger", app, documentFactory, {
		jsonDocumentUrl: "swagger/json",
	});

	await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
