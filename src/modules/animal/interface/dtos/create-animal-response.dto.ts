import { ApiProperty } from "@nestjs/swagger";

class BreedDto {
    @ApiProperty()
    name: string;
}

export class CreateAnimalResponseDto {

    @ApiProperty()
    id: number;

    @ApiProperty()
    name: string;

    @ApiProperty()
    breed: BreedDto;

    @ApiProperty()
    age: number;

    @ApiProperty()
    weight: number;

    @ApiProperty()
    userId: number;
}