import { beforeEach, describe, expect, it } from "bun:test";
import { makeWeeklyPerformanceWithSpecificData } from "test/factories/make-weekly-performance";
import { InMemoryDashboardRepository } from "test/repositories/in-memory-dashboard.repository";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { DashboardMetricsService } from "../services/dashboard-metrics.service";
import { GetDashboardPerformanceUseCase } from "./get-dashboard-performance.use-case";

let inMemoryDashboardRepository: InMemoryDashboardRepository;
let dashboardMetricsService: DashboardMetricsService;
let sut: GetDashboardPerformanceUseCase;

describe("GetDashboardPerformanceUseCase", () => {
	beforeEach(() => {
		inMemoryDashboardRepository = new InMemoryDashboardRepository();
		dashboardMetricsService = new DashboardMetricsService(
			inMemoryDashboardRepository,
		);
		sut = new GetDashboardPerformanceUseCase(dashboardMetricsService);
	});

	it("should get weekly performance for a company using string companyId", async () => {
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

		const result = await sut.execute({
			companyId: companyId.toString(),
		});

		expect(result).toBeDefined();
		expect(result.companyId.toString()).toBe(companyId.toString());
		expect(result.appointments.completed).toBe(78);
		expect(result.appointments.total).toBe(85);
		expect(result.appointments.percentage).toBe(92); // Math.round((78/85) * 100)
		expect(result.conversionRate.rate).toBe(85);
		expect(result.conversionRate.changePercentage).toBe(6.3); // (85-80)/80 * 100
		expect(result.satisfaction.rating).toBe(4.8);
		expect(result.satisfaction.baseCount).toBe(42);
	});

	it("should handle date filters", async () => {
		const companyId = new UniqueEntityID();
		const startDate = new Date("2024-01-01");
		const endDate = new Date("2024-01-07");

		const result = await sut.execute({
			companyId: companyId.toString(),
			startDate,
			endDate,
		});

		expect(result).toBeDefined();
		expect(result.companyId.toString()).toBe(companyId.toString());
		expect(result.weekStart).toBeInstanceOf(Date);
		expect(result.weekEnd).toBeInstanceOf(Date);
		expect(result.generatedAt).toBeInstanceOf(Date);
	});

	it("should work with predefined performance data", async () => {
		const companyId = new UniqueEntityID();
		const weekStart = new Date("2024-01-01");
		const weekEnd = new Date("2024-01-07");

		const predefinedPerformance = makeWeeklyPerformanceWithSpecificData({
			companyId,
			completed: 95,
			total: 100,
			conversionRate: 92,
			conversionChange: 8.5,
			satisfactionRating: 4.9,
			baseCount: 50,
			weekStart,
			weekEnd,
		});

		inMemoryDashboardRepository.addWeeklyPerformance(predefinedPerformance);

		const result = await sut.execute({
			companyId: companyId.toString(),
		});

		expect(result.appointments.completed).toBe(95);
		expect(result.appointments.total).toBe(100);
		expect(result.appointments.percentage).toBe(95); // Math.round((95/100) * 100)
		expect(result.conversionRate.rate).toBe(92);
		expect(result.conversionRate.changePercentage).toBe(8.5);
		expect(result.satisfaction.rating).toBe(4.9);
		expect(result.satisfaction.baseCount).toBe(50);
		expect(result.weekStart).toEqual(weekStart);
		expect(result.weekEnd).toEqual(weekEnd);
	});

	it("should handle empty or undefined date filters", async () => {
		const companyId = new UniqueEntityID();

		const result = await sut.execute({
			companyId: companyId.toString(),
			startDate: undefined,
			endDate: undefined,
		});

		expect(result).toBeDefined();
		expect(result.companyId.toString()).toBe(companyId.toString());
	});

	it("should convert string companyId to UniqueEntityID correctly", async () => {
		const companyIdString = "123e4567-e89b-12d3-a456-426614174000";

		inMemoryDashboardRepository.setMockPerformanceData({
			completedAppointments: 50,
			totalAppointments: 60,
		});

		const result = await sut.execute({
			companyId: companyIdString,
		});

		expect(result.companyId.toString()).toBe(companyIdString);
		expect(result.appointments.completed).toBe(50);
		expect(result.appointments.total).toBe(60);
	});

	it("should handle perfect appointment completion rate", async () => {
		const companyId = new UniqueEntityID();

		inMemoryDashboardRepository.setMockPerformanceData({
			completedAppointments: 100,
			totalAppointments: 100,
			conversionRate: 100,
		});

		const result = await sut.execute({
			companyId: companyId.toString(),
		});

		expect(result.appointments.completed).toBe(100);
		expect(result.appointments.total).toBe(100);
		expect(result.appointments.percentage).toBe(100);
		expect(result.conversionRate.rate).toBe(100);
	});

	it("should handle zero appointments case", async () => {
		const companyId = new UniqueEntityID();

		inMemoryDashboardRepository.setMockPerformanceData({
			completedAppointments: 0,
			totalAppointments: 0,
			conversionRate: 0,
		});

		const result = await sut.execute({
			companyId: companyId.toString(),
		});

		expect(result.appointments.completed).toBe(0);
		expect(result.appointments.total).toBe(0);
		expect(result.appointments.percentage).toBe(0);
		expect(result.conversionRate.rate).toBe(0);
	});

	it("should handle different combinations of optional parameters", async () => {
		const companyId = new UniqueEntityID();

		// Test with only startDate
		const resultWithStartDate = await sut.execute({
			companyId: companyId.toString(),
			startDate: new Date("2024-01-01"),
		});

		expect(resultWithStartDate).toBeDefined();

		// Test with only endDate
		const resultWithEndDate = await sut.execute({
			companyId: companyId.toString(),
			endDate: new Date("2024-01-07"),
		});

		expect(resultWithEndDate).toBeDefined();

		// Test with both dates
		const resultWithBothDates = await sut.execute({
			companyId: companyId.toString(),
			startDate: new Date("2024-01-01"),
			endDate: new Date("2024-01-07"),
		});

		expect(resultWithBothDates).toBeDefined();
	});

	it("should return performance data with proper data types", async () => {
		const companyId = new UniqueEntityID();

		const result = await sut.execute({
			companyId: companyId.toString(),
		});

		// Verify appointment performance types
		expect(typeof result.appointments.completed).toBe("number");
		expect(typeof result.appointments.total).toBe("number");
		expect(typeof result.appointments.percentage).toBe("number");

		// Verify conversion rate types
		expect(typeof result.conversionRate.rate).toBe("number");
		expect(typeof result.conversionRate.changePercentage).toBe("number");

		// Verify satisfaction types
		expect(typeof result.satisfaction.rating).toBe("number");
		expect(typeof result.satisfaction.baseCount).toBe("number");

		// Verify date types
		expect(result.weekStart).toBeInstanceOf(Date);
		expect(result.weekEnd).toBeInstanceOf(Date);
		expect(result.generatedAt).toBeInstanceOf(Date);
	});

	it("should ensure week end is after week start", async () => {
		const companyId = new UniqueEntityID();

		const result = await sut.execute({
			companyId: companyId.toString(),
		});

		expect(result.weekEnd.getTime()).toBeGreaterThanOrEqual(
			result.weekStart.getTime(),
		);
	});
});
