import { createZodDto } from "nestjs-zod";
import { serviceDto } from "./service.dto";

const request = serviceDto.partial();
export class UpdateServiceRequestDto extends createZodDto(request) {}
