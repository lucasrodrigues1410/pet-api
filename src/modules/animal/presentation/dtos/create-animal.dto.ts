import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsOptional, IsNumber, IsDateString } from "class-validator";

export class CreateAnimalDto {
    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    breedId: number;
    
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;
    
    @ApiProperty()
    @IsOptional()
    @IsDateString()
    birthdate: Date;
    
    @ApiProperty()
    @IsOptional()
    @IsNumber()
    weight: number;
}
