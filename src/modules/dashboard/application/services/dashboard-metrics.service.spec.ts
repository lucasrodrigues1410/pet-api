import { beforeEach, describe, expect, it } from "bun:test";
import { makeDashboardMetricsWithSpecificData } from "test/factories/make-dashboard-metrics";
import { makeWeeklyPerformanceWithSpecificData } from "test/factories/make-weekly-performance";
import { InMemoryDashboardRepository } from "test/repositories/in-memory-dashboard.repository";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { DashboardMetricsService } from "./dashboard-metrics.service";

let inMemoryDashboardRepository: InMemoryDashboardRepository;
let sut: DashboardMetricsService;

describe("DashboardMetricsService", () => {
	beforeEach(() => {
		inMemoryDashboardRepository = new InMemoryDashboardRepository();
		sut = new DashboardMetricsService(inMemoryDashboardRepository);
	});

	describe("getDashboardMetrics", () => {
		it("should get dashboard metrics for a company", async () => {
			const companyId = new UniqueEntityID();

			// Configure mock data
			inMemoryDashboardRepository.setMockMetricsData({
				appointmentsToday: 12,
				appointmentsYesterday: 10,
				monthlyRevenue: 4850,
				previousMonthRevenue: 4200,
				activeClientsThisMonth: 186,
				activeClientsPreviousMonth: 165,
				averageRating: 4.8,
				previousAverageRating: 4.6,
				baseCount: 42,
			});

			const result = await sut.getDashboardMetrics({
				companyId,
			});

			expect(result).toBeDefined();
			expect(result.companyId).toEqual(companyId);
			expect(result.appointmentsToday.count).toBe(12);
			expect(result.appointmentsToday.changePercentage).toBe(20); // (12-10)/10 * 100
			expect(result.monthlyRevenue.amount).toBe(4850);
			expect(result.monthlyRevenue.changePercentage).toBe(15.5); // (4850-4200)/4200 * 100
			expect(result.activeClients.count).toBe(186);
			expect(result.activeClients.changePercentage).toBe(12.7); // (186-165)/165 * 100
			expect(result.averageRating.rating).toBe(4.8);
			expect(result.averageRating.baseCount).toBe(42);
		});

		it("should return pre-configured metrics if they exist", async () => {
			const companyId = new UniqueEntityID();
			const predefinedMetrics = makeDashboardMetricsWithSpecificData({
				companyId,
				appointmentsToday: 25,
				monthlyRevenue: 7500,
				activeClients: 300,
			});

			inMemoryDashboardRepository.addDashboardMetrics(predefinedMetrics);

			const result = await sut.getDashboardMetrics({
				companyId,
			});

			expect(result.companyId).toEqual(companyId);
			expect(result.appointmentsToday.count).toBe(25);
			expect(result.monthlyRevenue.amount).toBe(7500);
			expect(result.activeClients.count).toBe(300);
		});

		it("should handle filters with date range", async () => {
			const companyId = new UniqueEntityID();
			const startDate = new Date("2024-01-01");
			const endDate = new Date("2024-01-31");

			const result = await sut.getDashboardMetrics({
				companyId,
				startDate,
				endDate,
			});

			expect(result).toBeDefined();
			expect(result.companyId).toEqual(companyId);
		});
	});

	describe("getWeeklyPerformance", () => {
		it("should get weekly performance for a company", async () => {
			const companyId = new UniqueEntityID();

			// Configure mock data
			inMemoryDashboardRepository.setMockPerformanceData({
				completedAppointments: 78,
				totalAppointments: 85,
				conversionRate: 85,
				previousConversionRate: 80,
				satisfactionRating: 4.8,
				satisfactionBaseCount: 42,
			});

			const result = await sut.getWeeklyPerformance({
				companyId,
			});

			expect(result).toBeDefined();
			expect(result.companyId).toEqual(companyId);
			expect(result.appointments.completed).toBe(78);
			expect(result.appointments.total).toBe(85);
			expect(result.appointments.percentage).toBe(92); // Math.round((78/85) * 100)
			expect(result.conversionRate.rate).toBe(85);
			expect(result.conversionRate.changePercentage).toBe(6.3); // (85-80)/80 * 100
			expect(result.satisfaction.rating).toBe(4.8);
			expect(result.satisfaction.baseCount).toBe(42);
		});

		it("should return pre-configured performance if it exists", async () => {
			const companyId = new UniqueEntityID();
			const predefinedPerformance = makeWeeklyPerformanceWithSpecificData({
				companyId,
				completed: 95,
				total: 100,
				conversionRate: 90,
			});

			inMemoryDashboardRepository.addWeeklyPerformance(predefinedPerformance);

			const result = await sut.getWeeklyPerformance({
				companyId,
			});

			expect(result.companyId).toEqual(companyId);
			expect(result.appointments.completed).toBe(95);
			expect(result.appointments.total).toBe(100);
			expect(result.conversionRate.rate).toBe(90);
		});

		it("should handle filters with date range", async () => {
			const companyId = new UniqueEntityID();
			const startDate = new Date("2024-01-01");
			const endDate = new Date("2024-01-07");

			const result = await sut.getWeeklyPerformance({
				companyId,
				startDate,
				endDate,
			});

			expect(result).toBeDefined();
			expect(result.companyId).toEqual(companyId);
		});
	});

	describe("getFullDashboardData", () => {
		it("should get both metrics and performance data", async () => {
			const companyId = new UniqueEntityID();

			// Configure mock data for both metrics and performance
			inMemoryDashboardRepository.setMockMetricsData({
				appointmentsToday: 15,
				monthlyRevenue: 5000,
				activeClientsThisMonth: 200,
			});

			inMemoryDashboardRepository.setMockPerformanceData({
				completedAppointments: 80,
				totalAppointments: 90,
				conversionRate: 88,
			});

			const result = await sut.getFullDashboardData({
				companyId,
			});

			expect(result).toBeDefined();
			expect(result.metrics).toBeDefined();
			expect(result.performance).toBeDefined();

			// Verify metrics
			expect(result.metrics.companyId).toEqual(companyId);
			expect(result.metrics.appointmentsToday.count).toBe(15);
			expect(result.metrics.monthlyRevenue.amount).toBe(5000);
			expect(result.metrics.activeClients.count).toBe(200);

			// Verify performance
			expect(result.performance.companyId).toEqual(companyId);
			expect(result.performance.appointments.completed).toBe(80);
			expect(result.performance.appointments.total).toBe(90);
			expect(result.performance.conversionRate.rate).toBe(88);
		});

		it("should handle both predefined and mock data", async () => {
			const companyId = new UniqueEntityID();

			// Add predefined metrics
			const predefinedMetrics = makeDashboardMetricsWithSpecificData({
				companyId,
				appointmentsToday: 20,
			});
			inMemoryDashboardRepository.addDashboardMetrics(predefinedMetrics);

			// Set mock performance data
			inMemoryDashboardRepository.setMockPerformanceData({
				completedAppointments: 75,
				totalAppointments: 80,
			});

			const result = await sut.getFullDashboardData({
				companyId,
			});

			expect(result.metrics.appointmentsToday.count).toBe(20); // From predefined
			expect(result.performance.appointments.completed).toBe(75); // From mock
		});

		it("should execute metrics and performance queries in parallel", async () => {
			const companyId = new UniqueEntityID();
			const startTime = Date.now();

			await sut.getFullDashboardData({
				companyId,
			});

			const endTime = Date.now();
			const executionTime = endTime - startTime;

			// Since we're using Promise.all, execution should be fast
			// This is more of a sanity check that the method completes
			expect(executionTime).toBeLessThan(100);
		});
	});
});
