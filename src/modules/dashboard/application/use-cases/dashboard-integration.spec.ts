import { beforeEach, describe, expect, it } from "bun:test";
import { makeDashboardMetricsWithSpecificData } from "test/factories/make-dashboard-metrics";
import { makeWeeklyPerformanceWithSpecificData } from "test/factories/make-weekly-performance";
import { InMemoryDashboardRepository } from "test/repositories/in-memory-dashboard.repository";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { DashboardMetricsService } from "../services/dashboard-metrics.service";
import { GetDashboardMetricsUseCase } from "./get-dashboard-metrics.use-case";
import { GetDashboardPerformanceUseCase } from "./get-dashboard-performance.use-case";

let inMemoryDashboardRepository: InMemoryDashboardRepository;
let dashboardMetricsService: DashboardMetricsService;
let getDashboardMetricsUseCase: GetDashboardMetricsUseCase;
let getDashboardPerformanceUseCase: GetDashboardPerformanceUseCase;

describe("Dashboard Integration Tests", () => {
	beforeEach(() => {
		inMemoryDashboardRepository = new InMemoryDashboardRepository();
		dashboardMetricsService = new DashboardMetricsService(
			inMemoryDashboardRepository,
		);
		getDashboardMetricsUseCase = new GetDashboardMetricsUseCase(
			dashboardMetricsService,
		);
		getDashboardPerformanceUseCase = new GetDashboardPerformanceUseCase(
			dashboardMetricsService,
		);
	});

	describe("Multi-company scenario", () => {
		it("should handle multiple companies with different data", async () => {
			const company1Id = new UniqueEntityID();
			const company2Id = new UniqueEntityID();

			// Add specific data for company 1
			const company1Metrics = makeDashboardMetricsWithSpecificData({
				companyId: company1Id,
				appointmentsToday: 10,
				monthlyRevenue: 3000,
			});

			const company1Performance = makeWeeklyPerformanceWithSpecificData({
				companyId: company1Id,
				completed: 40,
				total: 50,
			});

			// Add specific data for company 2
			const company2Metrics = makeDashboardMetricsWithSpecificData({
				companyId: company2Id,
				appointmentsToday: 25,
				monthlyRevenue: 7000,
			});

			const company2Performance = makeWeeklyPerformanceWithSpecificData({
				companyId: company2Id,
				completed: 90,
				total: 100,
			});

			inMemoryDashboardRepository.addDashboardMetrics(company1Metrics);
			inMemoryDashboardRepository.addWeeklyPerformance(company1Performance);
			inMemoryDashboardRepository.addDashboardMetrics(company2Metrics);
			inMemoryDashboardRepository.addWeeklyPerformance(company2Performance);

			// Test company 1
			const [metrics1, performance1] = await Promise.all([
				getDashboardMetricsUseCase.execute({
					companyId: company1Id.toString(),
				}),
				getDashboardPerformanceUseCase.execute({
					companyId: company1Id.toString(),
				}),
			]);

			expect(metrics1.appointmentsToday.count).toBe(10);
			expect(metrics1.monthlyRevenue.amount).toBe(3000);
			expect(performance1.appointments.completed).toBe(40);
			expect(performance1.appointments.total).toBe(50);

			// Test company 2
			const [metrics2, performance2] = await Promise.all([
				getDashboardMetricsUseCase.execute({
					companyId: company2Id.toString(),
				}),
				getDashboardPerformanceUseCase.execute({
					companyId: company2Id.toString(),
				}),
			]);

			expect(metrics2.appointmentsToday.count).toBe(25);
			expect(metrics2.monthlyRevenue.amount).toBe(7000);
			expect(performance2.appointments.completed).toBe(90);
			expect(performance2.appointments.total).toBe(100);
		});
	});

	describe("Service integration with use cases", () => {
		it("should maintain consistency between service and use case calls", async () => {
			const companyId = new UniqueEntityID();

			// Call through service
			const serviceMetrics = await dashboardMetricsService.getDashboardMetrics({
				companyId,
			});

			// Call through use case
			const useCaseMetrics = await getDashboardMetricsUseCase.execute({
				companyId: companyId.toString(),
			});

			// Results should be equivalent
			expect(serviceMetrics.appointmentsToday.count).toBe(
				useCaseMetrics.appointmentsToday.count,
			);
			expect(serviceMetrics.monthlyRevenue.amount).toBe(
				useCaseMetrics.monthlyRevenue.amount,
			);
			expect(serviceMetrics.activeClients.count).toBe(
				useCaseMetrics.activeClients.count,
			);
			expect(serviceMetrics.averageRating.rating).toBe(
				useCaseMetrics.averageRating.rating,
			);
		});

		it("should handle full dashboard data integration", async () => {
			const companyId = new UniqueEntityID();

			// Set specific mock data
			inMemoryDashboardRepository.setMockMetricsData({
				appointmentsToday: 15,
				monthlyRevenue: 5500,
			});

			inMemoryDashboardRepository.setMockPerformanceData({
				completedAppointments: 70,
				totalAppointments: 80,
			});

			// Get full dashboard data through service
			const fullData = await dashboardMetricsService.getFullDashboardData({
				companyId,
			});

			// Get individual data through use cases
			const [metrics, performance] = await Promise.all([
				getDashboardMetricsUseCase.execute({ companyId: companyId.toString() }),
				getDashboardPerformanceUseCase.execute({
					companyId: companyId.toString(),
				}),
			]);

			// Verify consistency
			expect(fullData.metrics.appointmentsToday.count).toBe(
				metrics.appointmentsToday.count,
			);
			expect(fullData.metrics.monthlyRevenue.amount).toBe(
				metrics.monthlyRevenue.amount,
			);
			expect(fullData.performance.appointments.completed).toBe(
				performance.appointments.completed,
			);
			expect(fullData.performance.appointments.total).toBe(
				performance.appointments.total,
			);
		});
	});

	describe("Date filtering integration", () => {
		it("should handle date filters consistently across all components", async () => {
			const companyId = new UniqueEntityID();
			const startDate = new Date("2024-01-01");
			const endDate = new Date("2024-01-31");

			// Test through service
			const [serviceMetrics, servicePerformance] = await Promise.all([
				dashboardMetricsService.getDashboardMetrics({
					companyId,
					startDate,
					endDate,
				}),
				dashboardMetricsService.getWeeklyPerformance({
					companyId,
					startDate,
					endDate,
				}),
			]);

			// Test through use cases
			const [useCaseMetrics, useCasePerformance] = await Promise.all([
				getDashboardMetricsUseCase.execute({
					companyId: companyId.toString(),
					startDate,
					endDate,
				}),
				getDashboardPerformanceUseCase.execute({
					companyId: companyId.toString(),
					startDate,
					endDate,
				}),
			]);

			// Verify consistency
			expect(serviceMetrics.companyId.toString()).toBe(
				useCaseMetrics.companyId.toString(),
			);
			expect(servicePerformance.companyId.toString()).toBe(
				useCasePerformance.companyId.toString(),
			);
		});
	});

	describe("Edge cases and error scenarios", () => {
		it("should handle concurrent requests for the same company", async () => {
			const companyId = new UniqueEntityID();

			// Execute multiple concurrent requests
			const promises = Array.from({ length: 5 }, () =>
				Promise.all([
					getDashboardMetricsUseCase.execute({
						companyId: companyId.toString(),
					}),
					getDashboardPerformanceUseCase.execute({
						companyId: companyId.toString(),
					}),
				]),
			);

			const results = await Promise.all(promises);

			// All results should be consistent
			const firstMetrics = results[0][0];
			const firstPerformance = results[0][1];

			results.forEach(([metrics, performance]) => {
				expect(metrics.appointmentsToday.count).toBe(
					firstMetrics.appointmentsToday.count,
				);
				expect(performance.appointments.completed).toBe(
					firstPerformance.appointments.completed,
				);
			});
		});

		it("should handle repository state changes during execution", async () => {
			const companyId = new UniqueEntityID();

			// Initial call
			const initialMetrics = await getDashboardMetricsUseCase.execute({
				companyId: companyId.toString(),
			});

			// Change repository state
			inMemoryDashboardRepository.setMockMetricsData({
				appointmentsToday: 999,
			});

			// Second call should reflect new state
			const updatedMetrics = await getDashboardMetricsUseCase.execute({
				companyId: companyId.toString(),
			});

			expect(updatedMetrics.appointmentsToday.count).toBe(999);
			expect(updatedMetrics.appointmentsToday.count).not.toBe(
				initialMetrics.appointmentsToday.count,
			);
		});

		it("should maintain data integrity with mixed predefined and mock data", async () => {
			const companyId = new UniqueEntityID();

			// Add predefined metrics but use mock performance
			const predefinedMetrics = makeDashboardMetricsWithSpecificData({
				companyId,
				appointmentsToday: 100,
			});

			inMemoryDashboardRepository.addDashboardMetrics(predefinedMetrics);
			inMemoryDashboardRepository.setMockPerformanceData({
				completedAppointments: 200,
				totalAppointments: 250,
			});

			const fullData = await dashboardMetricsService.getFullDashboardData({
				companyId,
			});

			expect(fullData.metrics.appointmentsToday.count).toBe(100); // From predefined
			expect(fullData.performance.appointments.completed).toBe(200); // From mock
			expect(fullData.performance.appointments.total).toBe(250); // From mock
		});
	});
});
