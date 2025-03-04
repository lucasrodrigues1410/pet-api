import { ApiProperty } from "@nestjs/swagger";
import { AnimalDto } from "./animal.dto";

export class ListAnimalsResponseDto {
    @ApiProperty({
        isArray: true,
        type: AnimalDto
    })
    animals: AnimalDto[];
}