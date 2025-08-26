import { DashboardMetrics } from "@/modules/dashboard/domain/entities/dashboard-metrics.entity";
import { WeeklyPerformance } from "@/modules/dashboard/domain/entities/weekly-performance.entity";
import {
	DashboardFilters,
	DashboardRepository,
} from "@/modules/dashboard/domain/interfaces/dashboard.repository.interface";
import { AppointmentPerformance } from "@/modules/dashboard/domain/value-objects/appointment-performance";
import { ConversionRate } from "@/modules/dashboard/domain/value-objects/conversion-rate";
import { MetricWithChange } from "@/modules/dashboard/domain/value-objects/metric-with-change";
import { RatingMetric } from "@/modules/dashboard/domain/value-objects/rating-metric";
import { RevenueMetric } from "@/modules/dashboard/domain/value-objects/revenue-metric";
import { SatisfactionMetric } from "@/modules/dashboard/domain/value-objects/satisfaction-metric";

export class InMemoryDashboardRepository implements DashboardRepository {
	public dashboardMetrics: DashboardMetrics[] = [];
	public weeklyPerformances: WeeklyPerformance[] = [];

	// Mock data for different scenarios
	private mockMetricsData = {
		appointmentsToday: 12,
		appointmentsYesterday: 10,
		monthlyRevenue: 4850,
		previousMonthRevenue: 4200,
		activeClientsThisMonth: 186,
		activeClientsPreviousMonth: 165,
		averageRating: 4.8,
		previousAverageRating: 4.6,
		baseCount: 42,
	};

	private mockPerformanceData = {
		completedAppointments: 78,
		totalAppointments: 85,
		conversionRate: 85,
		previousConversionRate: 80,
		satisfactionRating: 4.8,
		satisfactionBaseCount: 42,
	};

	async getDashboardMetrics(
		filters: DashboardFilters,
	): Promise<DashboardMetrics> {
		// Check if there's a pre-configured metric for this company
		const existingMetric = this.dashboardMetrics.find((metric) =>
			metric.companyId.equals(filters.companyId),
		);

		if (existingMetric) {
			return existingMetric;
		}

		// Generate mock metrics
		const appointmentsChangePercentage = this.calculatePercentageChange(
			this.mockMetricsData.appointmentsToday,
			this.mockMetricsData.appointmentsYesterday,
		);

		const revenueChangePercentage = this.calculatePercentageChange(
			this.mockMetricsData.monthlyRevenue,
			this.mockMetricsData.previousMonthRevenue,
		);

		const clientsChangePercentage = this.calculatePercentageChange(
			this.mockMetricsData.activeClientsThisMonth,
			this.mockMetricsData.activeClientsPreviousMonth,
		);

		const ratingChangePercentage = this.calculatePercentageChange(
			this.mockMetricsData.averageRating,
			this.mockMetricsData.previousAverageRating,
		);

		return DashboardMetrics.create({
			companyId: filters.companyId,
			appointmentsToday: MetricWithChange.create(
				this.mockMetricsData.appointmentsToday,
				appointmentsChangePercentage,
			),
			monthlyRevenue: RevenueMetric.create(
				this.mockMetricsData.monthlyRevenue,
				revenueChangePercentage,
			),
			activeClients: MetricWithChange.create(
				this.mockMetricsData.activeClientsThisMonth,
				clientsChangePercentage,
			),
			averageRating: RatingMetric.create(
				this.mockMetricsData.averageRating,
				ratingChangePercentage,
				this.mockMetricsData.baseCount,
			),
		});
	}

	async getWeeklyPerformance(
		filters: DashboardFilters,
	): Promise<WeeklyPerformance> {
		// Check if there's a pre-configured performance for this company
		const existingPerformance = this.weeklyPerformances.find((performance) =>
			performance.companyId.equals(filters.companyId),
		);

		if (existingPerformance) {
			return existingPerformance;
		}

		// Generate mock performance
		const conversionChangePercentage = this.calculatePercentageChange(
			this.mockPerformanceData.conversionRate,
			this.mockPerformanceData.previousConversionRate,
		);

		const weekStart = new Date();
		weekStart.setDate(weekStart.getDate() - 7);
		const weekEnd = new Date();

		return WeeklyPerformance.create({
			companyId: filters.companyId,
			appointments: AppointmentPerformance.create(
				this.mockPerformanceData.completedAppointments,
				this.mockPerformanceData.totalAppointments,
			),
			conversionRate: ConversionRate.create(
				this.mockPerformanceData.conversionRate,
				conversionChangePercentage,
			),
			satisfaction: SatisfactionMetric.create(
				this.mockPerformanceData.satisfactionRating,
				this.mockPerformanceData.satisfactionBaseCount,
			),
			weekStart,
			weekEnd,
		});
	}

	// Helper methods for testing
	public setMockMetricsData(data: Partial<typeof this.mockMetricsData>) {
		this.mockMetricsData = { ...this.mockMetricsData, ...data };
	}

	public setMockPerformanceData(
		data: Partial<typeof this.mockPerformanceData>,
	) {
		this.mockPerformanceData = { ...this.mockPerformanceData, ...data };
	}

	public addDashboardMetrics(metrics: DashboardMetrics) {
		this.dashboardMetrics.push(metrics);
	}

	public addWeeklyPerformance(performance: WeeklyPerformance) {
		this.weeklyPerformances.push(performance);
	}

	public clear() {
		this.dashboardMetrics = [];
		this.weeklyPerformances = [];
	}

	private calculatePercentageChange(current: number, previous: number): number {
		if (previous === 0) return current > 0 ? 100 : 0;
		return Math.round(((current - previous) / previous) * 100 * 10) / 10;
	}
}
