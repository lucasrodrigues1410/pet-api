import { faker } from "@faker-js/faker";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import {
	WeeklyPerformance,
	WeeklyPerformanceProps,
} from "@/modules/dashboard/domain/entities/weekly-performance.entity";
import { AppointmentPerformance } from "@/modules/dashboard/domain/value-objects/appointment-performance";
import { ConversionRate } from "@/modules/dashboard/domain/value-objects/conversion-rate";
import { SatisfactionMetric } from "@/modules/dashboard/domain/value-objects/satisfaction-metric";

export function makeWeeklyPerformance(
	override: Partial<WeeklyPerformanceProps> = {},
	id?: UniqueEntityID,
): WeeklyPerformance {
	const completed = faker.number.int({ min: 50, max: 100 });
	const total = faker.number.int({ min: completed, max: completed + 20 });
	const conversionRate = faker.number.int({ min: 70, max: 95 });
	const satisfactionRating = faker.number.float({
		min: 4.0,
		max: 5.0,
		fractionDigits: 1,
	});
	const baseCount = faker.number.int({ min: 20, max: 80 });

	const weekStart = faker.date.recent({ days: 7 });
	const weekEnd = new Date(weekStart);
	weekEnd.setDate(weekEnd.getDate() + 7);

	const defaultProps: WeeklyPerformanceProps = {
		companyId: new UniqueEntityID(),
		appointments: AppointmentPerformance.create(completed, total),
		conversionRate: ConversionRate.create(
			conversionRate,
			faker.number.float({ min: -10, max: 15, fractionDigits: 1 }),
		),
		satisfaction: SatisfactionMetric.create(satisfactionRating, baseCount),
		weekStart,
		weekEnd,
		generatedAt: faker.date.recent(),
		...override,
	};

	return WeeklyPerformance.create(defaultProps, id);
}

export function makeWeeklyPerformanceWithSpecificData(data: {
	companyId?: UniqueEntityID;
	completed?: number;
	total?: number;
	conversionRate?: number;
	conversionChange?: number;
	satisfactionRating?: number;
	baseCount?: number;
	weekStart?: Date;
	weekEnd?: Date;
}): WeeklyPerformance {
	const weekStart = data.weekStart || new Date();
	weekStart.setDate(weekStart.getDate() - 7);
	const weekEnd = data.weekEnd || new Date();

	return makeWeeklyPerformance({
		companyId: data.companyId || new UniqueEntityID(),
		appointments: AppointmentPerformance.create(
			data.completed || 78,
			data.total || 85,
		),
		conversionRate: ConversionRate.create(
			data.conversionRate || 85,
			data.conversionChange || 5.0,
		),
		satisfaction: SatisfactionMetric.create(
			data.satisfactionRating || 4.8,
			data.baseCount || 42,
		),
		weekStart,
		weekEnd,
	});
}


