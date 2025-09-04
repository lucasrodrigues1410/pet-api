import { createZodDto } from "nestjs-zod";
import z from "zod";
import { staffRole } from "@/modules/staff/domain/entities/staff.entity";

const inviteEmployeeRequest = z.object({
	name: z.string().min(1, "Nome é obrigatório"),
	email: z.email("Email deve ser válido"),
	role: z.enum(staffRole),
});

const inviteEmployeeResponse = z.object({
	inviteId: z.string(),
	token: z.string(),
	message: z.string(),
});

export class InviteEmployeeRequestDto extends createZodDto(
	inviteEmployeeRequest,
) {}
export class InviteEmployeeResponseDto extends createZodDto(
	inviteEmployeeResponse,
) {}
