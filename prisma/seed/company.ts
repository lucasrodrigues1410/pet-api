import { set } from "date-fns";
import { PrismaClient } from "prisma/generated/client";
import { daysOfWeek } from "@/modules/company-availability/domain/entities/company-availability.entity";

export async function createCompany(prisma: PrismaClient) {
	await prisma.company.upsert({
		where: { id: "company-1" },
		update: {},
		create: {
			id: "company-1",
			name: "Pet Shop",
		},
	});
	await prisma.userCompany.upsert({
		where: { id: "user-company-1" },
		update: {},
		create: {
			id: "user-company-1",
			userId: "user-2",
			companyId: "company-1",
			role: "ADMIN",
		},
	});

	for (const day of daysOfWeek) {
		await prisma.companyAvailability.upsert({
			where: { id: `company-1-${day}` },
			update: {},
			create: {
				id: `company-1-${day}`,
				companyId: "company-1",
				day,
				startTime: set(new Date(), {
					hours: 8,
					minutes: 0,
					seconds: 0,
					milliseconds: 0,
				}).toISOString(),
				endTime: set(new Date(), {
					hours: 18,
					minutes: 0,
					seconds: 0,
					milliseconds: 0,
				}).toISOString(),
				lunchStartTime: set(new Date(), {
					hours: 12,
					minutes: 0,
					seconds: 0,
					milliseconds: 0,
				}).toISOString(),
				lunchEndTime: set(new Date(), {
					hours: 13,
					minutes: 0,
					seconds: 0,
					milliseconds: 0,
				}).toISOString(),
			},
		});
	}
}
