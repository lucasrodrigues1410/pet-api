import { ValueObject } from "@/core/domain/entities/value-object";

export interface AppointmentPerformanceProps {
	completed: number;
	total: number;
	percentage: number;
}

export class AppointmentPerformance extends ValueObject<AppointmentPerformanceProps> {
	get completed() {
		return this.props.completed;
	}

	get total() {
		return this.props.total;
	}

	get percentage() {
		return this.props.percentage;
	}

	private constructor(props: AppointmentPerformanceProps) {
		super(props);
	}

	static create(completed: number, total: number): AppointmentPerformance {
		if (completed < 0 || total < 0) {
			throw new Error("Appointment counts must be non-negative");
		}
		if (completed > total) {
			throw new Error("Completed cannot be greater than total");
		}

		const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

		return new AppointmentPerformance({
			completed,
			total,
			percentage,
		});
	}
}
