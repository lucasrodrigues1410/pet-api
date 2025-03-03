import { ApiProperty } from "@nestjs/swagger";

export class AnimalDto {

    @ApiProperty()
    id: number;

    @ApiProperty()
    name: string;

    @ApiProperty()
    breed: string;

    @ApiProperty()
    age: number;

    @ApiProperty()
    weight: number;

    @ApiProperty()
    userId: number;
}