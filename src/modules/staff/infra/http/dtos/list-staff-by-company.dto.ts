import { createZodDto } from "nestjs-zod";
import z from "zod";
import { StaffRole, staffRole } from "@/modules/staff/domain/entities/staff.entity";
import { userDto } from "@/modules/user/infra/http/dtos/user.dto";
import { makePaginatedDto } from "@/shared/utils/pagination";
import { paginationQuerySchema } from "@/shared/utils/pagination-query";
import { staffDto } from "./staff.dto";

const queryDto = paginationQuerySchema.extend({
	query: z.string().optional(),
	roles: z
		.string()
		.transform((val) => val.split(",") as StaffRole[])
		.refine(
			(val) => val.every((role) => staffRole.includes(role as StaffRole)),
			{
				message: "Roles inválidos",
			},
		).optional(),
});

const respondeDto = makePaginatedDto(
	staffDto.extend({
		user: userDto,
	}),
);

export class ListStaffByCompanyQueryDto extends createZodDto(queryDto) {}
export class ListStaffByCompanyResponseDto extends createZodDto(respondeDto) {}
