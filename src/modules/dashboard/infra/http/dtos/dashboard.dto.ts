import { stringToDate } from "@/shared/schemas/string-to-date";
import { z } from "zod";

export const metricWithChangeDto = z.object({
	count: z.number(),
	changePercentage: z.number(),
});

export const revenueMetricDto = z.object({
	amount: z.number(),
	changePercentage: z.number(),
});

export const ratingMetricDto = z.object({
	rating: z.number(),
	changePercentage: z.number(),
	baseCount: z.number(),
});

export const dashboardMetricsDto = z.object({
	appointmentsToday: metricWithChangeDto,
	monthlyRevenue: revenueMetricDto,
	activeClients: metricWithChangeDto,
	averageRating: ratingMetricDto,
});

export const appointmentPerformanceDto = z.object({
	completed: z.number(),
	total: z.number(),
	percentage: z.number(),
});

export const conversionRateDto = z.object({
	rate: z.number(),
	changePercentage: z.number(),
});

export const satisfactionMetricDto = z.object({
	rating: z.number(),
	baseCount: z.number(),
});

export const weeklyPerformanceDto = z.object({
	appointments: appointmentPerformanceDto,
	conversionRate: conversionRateDto,
	satisfaction: satisfactionMetricDto,
});

export const FullDashboardDto = z.object({
	metrics: dashboardMetricsDto,
	performance: weeklyPerformanceDto,
});

export const DashboardFiltersDto = z.object({
	companyId: z.string(),
	startDate: stringToDate.optional(),
	endDate: stringToDate.optional(),
});
