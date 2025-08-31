import { createZodDto } from "nestjs-zod";
import {
	appointmentPerformanceDto,
	conversionRateDto,
	dashboardMetricsDto,
	metricWithChangeDto,
	ratingMetricDto,
	revenueMetricDto,
	satisfactionMetricDto,
	weeklyPerformanceDto,
} from "./dashboard.dto";

export class MetricWithChangeResponse extends createZodDto(
	metricWithChangeDto,
) {}
export class RevenueMetricResponse extends createZodDto(revenueMetricDto) {}
export class RatingMetricResponse extends createZodDto(ratingMetricDto) {}
export class DashboardMetricsResponse extends createZodDto(
	dashboardMetricsDto,
) {}

export class AppointmentPerformanceResponse extends createZodDto(
	appointmentPerformanceDto,
) {}
export class ConversionRateResponse extends createZodDto(conversionRateDto) {}
export class SatisfactionMetricResponse extends createZodDto(
	satisfactionMetricDto,
) {}
export class WeeklyPerformanceResponse extends createZodDto(
	weeklyPerformanceDto,
) {}
