import { ApiProperty } from "@nestjs/swagger";

export class UploadAnimalImageDto {
	@ApiProperty({
		type: "string",
		format: "binary",
		description: "Arquivo de imagem a ser enviado",
	})
	file: any;
}
