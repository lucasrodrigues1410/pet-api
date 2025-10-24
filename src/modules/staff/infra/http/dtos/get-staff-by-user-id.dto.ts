import { createZodDto } from "nestjs-zod";
import { staffDto } from "./staff.dto";

export class GetStaffByUserIdDto extends createZodDto(staffDto) {}