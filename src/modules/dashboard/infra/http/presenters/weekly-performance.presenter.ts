import { WeeklyPerformance } from "@/modules/dashboard/domain/entities/weekly-performance.entity";
import { AppointmentPerformancePresenter } from "./appointment-performance.presenter";
import { ConversionRatePresenter } from "./conversion-rate.presenter";
import { SatisfactionMetricPresenter } from "./satisfaction-metric.presenter";

export class WeeklyPerformancePresenter {
	static present(performance: WeeklyPerformance) {
		return {
			appointments: AppointmentPerformancePresenter.present(
				performance.appointments,
			),
			conversionRate: ConversionRatePresenter.present(
				performance.conversionRate,
			),
			satisfaction: SatisfactionMetricPresenter.present(
				performance.satisfaction,
			),
		};
	}
}
