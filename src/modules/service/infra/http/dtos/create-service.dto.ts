import { createZodDto } from "nestjs-zod";
import { serviceDto } from "./service.dto";

const request = serviceDto;
export class CreateServiceRequestDto extends createZodDto(request) {}
