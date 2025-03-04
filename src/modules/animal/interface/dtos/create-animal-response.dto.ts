import { OmitType } from "@nestjs/swagger";
import { AnimalDto } from "./animal.dto";

export class CreateAnimalResponseDto extends OmitType(AnimalDto, ["breed"]) {}
