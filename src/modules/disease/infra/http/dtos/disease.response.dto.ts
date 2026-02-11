import { createZodDto } from "nestjs-zod";
import { z } from "zod";
import { diseaseDto } from "./disease.dto";

const listResponse = z.object({ items: z.array(diseaseDto) });

export class DiseaseResponse extends createZodDto(diseaseDto) {}
export class DiseaseListResponse extends createZodDto(listResponse) {}
