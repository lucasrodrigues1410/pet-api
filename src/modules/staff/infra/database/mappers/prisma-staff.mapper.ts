import {
	Prisma,
	Appointment as PrismaAppointment,
	UserCompany as PrismaUserCompany,
} from "prisma/generated/client";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { PrismaAppointmentMapper } from "@/modules/appointment/infra/database/mapper/prisma-appointment.mapper";
import {
	Staff,
	type StaffRole,
} from "@/modules/staff/domain/entities/staff.entity";

export class PrismaStaffMapper {
	static toDomain(
		prismaUserCompany: PrismaUserCompany & {
			appointment?: PrismaAppointment[];
		},
	): Staff {
		const appointments = prismaUserCompany.appointment?.map(
			PrismaAppointmentMapper.toDomain,
		);

		return Staff.create(
			{
				companyId: new UniqueEntityID(prismaUserCompany.companyId),
				userId: new UniqueEntityID(prismaUserCompany.userId),
				role: prismaUserCompany.role as StaffRole,
				appointments,
				createdAt: prismaUserCompany.createdAt,
				updatedAt: prismaUserCompany.updatedAt,
				deletedAt: prismaUserCompany.deletedAt ?? undefined,
			},
			new UniqueEntityID(prismaUserCompany.id),
		);
	}

	static toPersistence(staff: Staff): Prisma.UserCompanyUncheckedCreateInput {
		return {
			id: staff.id.toString(),
			companyId: staff.companyId.toString(),
			userId: staff.userId.toString(),
			role: staff.role,
			createdAt: staff.createdAt,
			updatedAt: staff.updatedAt,
			deletedAt: staff.deletedAt,
		};
	}
}
