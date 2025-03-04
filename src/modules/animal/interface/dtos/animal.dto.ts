import { ApiProperty, OmitType } from "@nestjs/swagger";
import { BreedDto } from "src/modules/breed/interface/dtos/breed.dto";

class Breed extends OmitType(BreedDto, ['id']) {}

export class AnimalDto {

    @ApiProperty()
    id: number;

    @ApiProperty()
    name: string;

    @ApiProperty()
    breed: Breed;

    @ApiProperty()
    age: number;

    @ApiProperty()
    weight: number;

    @ApiProperty()
    userId: number;
}