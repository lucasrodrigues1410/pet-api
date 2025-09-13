import { AppointmentPerformance } from "@/modules/dashboard/domain/value-objects/appointment-performance";

export class AppointmentPerformancePresenter {
	static present(performance: AppointmentPerformance) {
		return {
			completed: performance.completed,
			total: performance.total,
			percentage: performance.percentage,
		};
	}
}
