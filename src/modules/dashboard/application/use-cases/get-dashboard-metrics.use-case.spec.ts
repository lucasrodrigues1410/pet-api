import { beforeEach, describe, expect, it } from "bun:test";
import { makeDashboardMetricsWithSpecificData } from "test/factories/make-dashboard-metrics";
import { InMemoryDashboardRepository } from "test/repositories/in-memory-dashboard.repository";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { DashboardMetricsService } from "../services/dashboard-metrics.service";
import { GetDashboardMetricsUseCase } from "./get-dashboard-metrics.use-case";

let inMemoryDashboardRepository: InMemoryDashboardRepository;
let dashboardMetricsService: DashboardMetricsService;
let sut: GetDashboardMetricsUseCase;

describe("GetDashboardMetricsUseCase", () => {
	beforeEach(() => {
		inMemoryDashboardRepository = new InMemoryDashboardRepository();
		dashboardMetricsService = new DashboardMetricsService(
			inMemoryDashboardRepository,
		);
		sut = new GetDashboardMetricsUseCase(dashboardMetricsService);
	});

	it("should get dashboard metrics for a company using string companyId", async () => {
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
			baseCount: 42,
		});

		const result = await sut.execute({
			companyId: companyId.toString(),
		});

		expect(result).toBeDefined();
		expect(result.companyId.toString()).toBe(companyId.toString());
		expect(result.appointmentsToday.count).toBe(12);
		expect(result.appointmentsToday.changePercentage).toBe(20);
		expect(result.monthlyRevenue.amount).toBe(4850);
		expect(result.monthlyRevenue.changePercentage).toBe(15.5);
		expect(result.activeClients.count).toBe(186);
		expect(result.averageRating.rating).toBe(4.8);
		expect(result.averageRating.baseCount).toBe(42);
	});

	it("should handle date filters", async () => {
		const companyId = new UniqueEntityID();
		const startDate = new Date("2024-01-01");
		const endDate = new Date("2024-01-31");

		const result = await sut.execute({
			companyId: companyId.toString(),
			startDate,
			endDate,
		});

		expect(result).toBeDefined();
		expect(result.companyId.toString()).toBe(companyId.toString());
		expect(result.generatedAt).toBeInstanceOf(Date);
	});

	it("should work with predefined metrics", async () => {
		const companyId = new UniqueEntityID();
		const predefinedMetrics = makeDashboardMetricsWithSpecificData({
			companyId,
			appointmentsToday: 25,
			appointmentsChange: 15.5,
			monthlyRevenue: 7500,
			revenueChange: 20.0,
			activeClients: 300,
			clientsChange: 8.5,
			averageRating: 4.9,
			ratingChange: 0.3,
			baseCount: 60,
		});

		inMemoryDashboardRepository.addDashboardMetrics(predefinedMetrics);

		const result = await sut.execute({
			companyId: companyId.toString(),
		});

		expect(result.appointmentsToday.count).toBe(25);
		expect(result.appointmentsToday.changePercentage).toBe(15.5);
		expect(result.monthlyRevenue.amount).toBe(7500);
		expect(result.monthlyRevenue.changePercentage).toBe(20.0);
		expect(result.activeClients.count).toBe(300);
		expect(result.activeClients.changePercentage).toBe(8.5);
		expect(result.averageRating.rating).toBe(4.9);
		expect(result.averageRating.changePercentage).toBe(0.3);
		expect(result.averageRating.baseCount).toBe(60);
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

		inMemoryDashboardRepository.setMockMetricsData({
			appointmentsToday: 5,
		});

		const result = await sut.execute({
			companyId: companyIdString,
		});

		expect(result.companyId.toString()).toBe(companyIdString);
		expect(result.appointmentsToday.count).toBe(5);
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
			endDate: new Date("2024-01-31"),
		});

		expect(resultWithEndDate).toBeDefined();

		// Test with both dates
		const resultWithBothDates = await sut.execute({
			companyId: companyId.toString(),
			startDate: new Date("2024-01-01"),
			endDate: new Date("2024-01-31"),
		});

		expect(resultWithBothDates).toBeDefined();
	});

	it("should return metrics with proper data types", async () => {
		const companyId = new UniqueEntityID();

		const result = await sut.execute({
			companyId: companyId.toString(),
		});

		// Verify types
		expect(typeof result.appointmentsToday.count).toBe("number");
		expect(typeof result.appointmentsToday.changePercentage).toBe("number");
		expect(typeof result.monthlyRevenue.amount).toBe("number");
		expect(typeof result.monthlyRevenue.changePercentage).toBe("number");
		expect(typeof result.activeClients.count).toBe("number");
		expect(typeof result.activeClients.changePercentage).toBe("number");
		expect(typeof result.averageRating.rating).toBe("number");
		expect(typeof result.averageRating.changePercentage).toBe("number");
		expect(typeof result.averageRating.baseCount).toBe("number");
		expect(result.generatedAt).toBeInstanceOf(Date);
	});
});
