import { Entity } from "@/core/domain/entities/entity";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { AppointmentPerformance } from "../value-objects/appointment-performance";
import { ConversionRate } from "../value-objects/conversion-rate";
import { SatisfactionMetric } from "../value-objects/satisfaction-metric";

export interface WeeklyPerformanceProps {
	companyId: UniqueEntityID;
	appointments: AppointmentPerformance;
	conversionRate: ConversionRate;
	satisfaction: SatisfactionMetric;
	weekStart: Date;
	weekEnd: Date;
	generatedAt: Date;
}

export class WeeklyPerformance extends Entity<WeeklyPerformanceProps> {
	get companyId() {
		return this.props.companyId;
	}

	get appointments() {
		return this.props.appointments;
	}

	get conversionRate() {
		return this.props.conversionRate;
	}

	get satisfaction() {
		return this.props.satisfaction;
	}

	get weekStart() {
		return this.props.weekStart;
	}

	get weekEnd() {
		return this.props.weekEnd;
	}

	get generatedAt() {
		return this.props.generatedAt;
	}

	static create(
		props: Omit<WeeklyPerformanceProps, "generatedAt"> & {
			generatedAt?: Date;
		},
		id?: UniqueEntityID,
	): WeeklyPerformance {
		return new WeeklyPerformance(
			{
				...props,
				generatedAt: props.generatedAt ?? new Date(),
			},
			id,
		);
	}

	public toObject() {
		return {
			id: this.id.toString(),
			companyId: this.companyId.toString(),
			appointments: {
				completed: this.appointments.completed,
				total: this.appointments.total,
				percentage: this.appointments.percentage,
			},
			conversionRate: {
				rate: this.conversionRate.rate,
				changePercentage: this.conversionRate.changePercentage,
			},
			satisfaction: {
				rating: this.satisfaction.rating,
				baseCount: this.satisfaction.baseCount,
			},
			weekStart: this.weekStart.toISOString(),
			weekEnd: this.weekEnd.toISOString(),
			generatedAt: this.generatedAt.toISOString(),
		};
	}
}
