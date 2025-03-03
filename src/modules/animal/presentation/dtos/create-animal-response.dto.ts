import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

export class CreateAnimalResponseDto {
    @ApiProperty()
    @IsNumber()
    id: number;
}