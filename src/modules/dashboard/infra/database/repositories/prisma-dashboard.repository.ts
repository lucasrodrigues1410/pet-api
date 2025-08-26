import { Injectable } from "@nestjs/common";
import {
	endOfDay,
	endOfMonth,
	startOfDay,
	startOfMonth,
	subDays,
	subMonths,
} from "date-fns";
import { AppointmentStatus } from "prisma/generated/client";
import { PrismaService } from "@/core/infra/prisma/prisma.service";
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

@Injectable()
export class PrismaDashboardRepository implements DashboardRepository {
	constructor(private readonly prisma: PrismaService) {}

	async getDashboardMetrics(
		filters: DashboardFilters,
	): Promise<DashboardMetrics> {
		const companyId = filters.companyId.toString();
		const today = new Date();
		const yesterday = subDays(today, 1);
		const currentMonth = new Date();
		const previousMonth = subMonths(currentMonth, 1);

		// Agendamentos hoje vs ontem
		const [appointmentsToday, appointmentsYesterday] = await Promise.all([
			this.getAppointmentCount(companyId, startOfDay(today), endOfDay(today)),
			this.getAppointmentCount(
				companyId,
				startOfDay(yesterday),
				endOfDay(yesterday),
			),
		]);

		// Faturamento mensal vs mês anterior
		const [monthlyRevenue, previousMonthRevenue] = await Promise.all([
			this.getRevenue(
				companyId,
				startOfMonth(currentMonth),
				endOfMonth(currentMonth),
			),
			this.getRevenue(
				companyId,
				startOfMonth(previousMonth),
				endOfMonth(previousMonth),
			),
		]);

		// Clientes ativos este mês vs mês anterior
		const [activeClientsThisMonth, activeClientsPreviousMonth] =
			await Promise.all([
				this.getActiveClients(
					companyId,
					startOfMonth(currentMonth),
					endOfMonth(currentMonth),
				),
				this.getActiveClients(
					companyId,
					startOfMonth(previousMonth),
					endOfMonth(previousMonth),
				),
			]);

		// Avaliação média (simulada - como não há tabela de avaliações, usaremos uma lógica baseada em agendamentos concluídos)
		const averageRating = await this.getAverageRating(companyId);

		return DashboardMetrics.create({
			companyId: filters.companyId,
			appointmentsToday: MetricWithChange.create(
				appointmentsToday,
				this.calculatePercentageChange(
					appointmentsToday,
					appointmentsYesterday,
				),
			),
			monthlyRevenue: RevenueMetric.create(
				monthlyRevenue,
				this.calculatePercentageChange(monthlyRevenue, previousMonthRevenue),
			),
			activeClients: MetricWithChange.create(
				activeClientsThisMonth,
				this.calculatePercentageChange(
					activeClientsThisMonth,
					activeClientsPreviousMonth,
				),
			),
			averageRating: RatingMetric.create(
				averageRating.rating,
				averageRating.changePercentage,
				averageRating.baseCount,
			),
		});
	}

	async getWeeklyPerformance(
		filters: DashboardFilters,
	): Promise<WeeklyPerformance> {
		const companyId = filters.companyId.toString();
		const weekStart = subDays(new Date(), 7);
		const weekEnd = new Date();
		const previousWeekStart = subDays(weekStart, 7);
		const previousWeekEnd = weekStart;

		// Performance de agendamentos da semana
		const [scheduledAppointments, completedAppointments] = await Promise.all([
			this.getAppointmentsByStatus(companyId, weekStart, weekEnd, undefined),
			this.getAppointmentsByStatus(
				companyId,
				weekStart,
				weekEnd,
				AppointmentStatus.COMPLETED,
			),
		]);

		// Taxa de conversão (simulada - agendamentos confirmados vs agendados)
		const [confirmedThisWeek, confirmedPreviousWeek] = await Promise.all([
			this.getAppointmentsByStatus(
				companyId,
				weekStart,
				weekEnd,
				AppointmentStatus.CONFIRMED,
			),
			this.getAppointmentsByStatus(
				companyId,
				previousWeekStart,
				previousWeekEnd,
				AppointmentStatus.CONFIRMED,
			),
		]);

		const conversionRate =
			scheduledAppointments > 0
				? (confirmedThisWeek / scheduledAppointments) * 100
				: 0;
		const previousConversionRate = await this.getAppointmentsByStatus(
			companyId,
			previousWeekStart,
			previousWeekEnd,
			undefined,
		);
		const previousConfirmedRate =
			previousConversionRate > 0
				? (confirmedPreviousWeek / previousConversionRate) * 100
				: 0;

		// Satisfação (simulada com base em agendamentos concluídos)
		const satisfaction = await this.getSatisfactionMetric(
			companyId,
			weekStart,
			weekEnd,
		);

		return WeeklyPerformance.create({
			companyId: filters.companyId,
			appointments: AppointmentPerformance.create(
				completedAppointments,
				scheduledAppointments,
			),
			conversionRate: ConversionRate.create(
				Math.round(conversionRate),
				this.calculatePercentageChange(conversionRate, previousConfirmedRate),
			),
			satisfaction: SatisfactionMetric.create(
				satisfaction.rating,
				satisfaction.baseCount,
			),
			weekStart,
			weekEnd,
		});
	}

	private async getAppointmentCount(
		companyId: string,
		startDate: Date,
		endDate: Date,
	): Promise<number> {
		return this.prisma.appointment.count({
			where: {
				companyId,
				createdAt: {
					gte: startDate,
					lte: endDate,
				},
				deletedAt: null,
			},
		});
	}

	private async getRevenue(
		companyId: string,
		startDate: Date,
		endDate: Date,
	): Promise<number> {
		const result = await this.prisma.appointment.aggregate({
			where: {
				companyId,
				createdAt: {
					gte: startDate,
					lte: endDate,
				},
				status: AppointmentStatus.COMPLETED,
				deletedAt: null,
			},
			_sum: {
				price: true,
			},
		});

		return Number(result._sum.price) || 0;
	}

	private async getActiveClients(
		companyId: string,
		startDate: Date,
		endDate: Date,
	): Promise<number> {
		const result = await this.prisma.appointment.findMany({
			where: {
				companyId,
				createdAt: {
					gte: startDate,
					lte: endDate,
				},
				deletedAt: null,
			},
			select: {
				clientId: true,
			},
			distinct: ["clientId"],
		});

		return result.length;
	}

	private async getAppointmentsByStatus(
		companyId: string,
		startDate: Date,
		endDate: Date,
		status?: AppointmentStatus,
	): Promise<number> {
		return this.prisma.appointment.count({
			where: {
				companyId,
				createdAt: {
					gte: startDate,
					lte: endDate,
				},
				...(status && { status }),
				deletedAt: null,
			},
		});
	}

	private async getAverageRating(
		companyId: string,
	): Promise<{ rating: number; changePercentage: number; baseCount: number }> {
		const last30Days = subDays(new Date(), 30);
		const previous30Days = subDays(last30Days, 30);

		// Simulando avaliação baseada na taxa de conclusão de agendamentos
		const [completedLast30, totalLast30, completedPrevious30, totalPrevious30] =
			await Promise.all([
				this.getAppointmentsByStatus(
					companyId,
					last30Days,
					new Date(),
					AppointmentStatus.COMPLETED,
				),
				this.getAppointmentsByStatus(companyId, last30Days, new Date()),
				this.getAppointmentsByStatus(
					companyId,
					previous30Days,
					last30Days,
					AppointmentStatus.COMPLETED,
				),
				this.getAppointmentsByStatus(companyId, previous30Days, last30Days),
			]);

		const currentRating = this.calculateRatingFromCompletionRate(
			completedLast30,
			totalLast30,
		);
		const previousRating = this.calculateRatingFromCompletionRate(
			completedPrevious30,
			totalPrevious30,
		);

		return {
			rating: currentRating,
			changePercentage: this.calculatePercentageChange(
				currentRating,
				previousRating,
			),
			baseCount: totalLast30,
		};
	}

	private async getSatisfactionMetric(
		companyId: string,
		startDate: Date,
		endDate: Date,
	): Promise<{ rating: number; baseCount: number }> {
		const [completed, total] = await Promise.all([
			this.getAppointmentsByStatus(
				companyId,
				startDate,
				endDate,
				AppointmentStatus.COMPLETED,
			),
			this.getAppointmentsByStatus(companyId, startDate, endDate),
		]);

		return {
			rating: this.calculateRatingFromCompletionRate(completed, total),
			baseCount: total,
		};
	}

	private calculateRatingFromCompletionRate(
		completed: number,
		total: number,
	): number {
		if (total === 0) return 4.5; // Rating padrão
		const completionRate = completed / total;
		// Converte taxa de conclusão em rating de 3.0 a 5.0
		return Math.round((3.0 + completionRate * 2.0) * 10) / 10;
	}

	private calculatePercentageChange(current: number, previous: number): number {
		if (previous === 0) return current > 0 ? 100 : 0;
		return Math.round(((current - previous) / previous) * 100 * 10) / 10;
	}
}
