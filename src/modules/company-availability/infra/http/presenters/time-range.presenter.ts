import { TimeRange } from "@/modules/company-availability/domain/entities/value-objects/time-range";

export class TimeRangePresenter {
	static present(timeRange: TimeRange) {
		return { startTime: timeRange.startTime, endTime: timeRange.endTime };
	}
}
