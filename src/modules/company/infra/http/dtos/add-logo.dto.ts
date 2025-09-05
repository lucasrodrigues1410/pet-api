import { ApiProperty } from "@nestjs/swagger";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export class UploadImageDto {
	@ApiProperty({
		type: "string",
		format: "binary",
		description: "Arquivo de imagem a ser enviado",
	})
	file: any;
}

export const AddLogoResponseDto = z.object({
	message: z.string(),
});

export class AddLogoResponseDtoClass extends createZodDto(AddLogoResponseDto) {}
