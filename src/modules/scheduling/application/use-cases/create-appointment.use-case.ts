import { Either, left, right } from "@/core/either";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found.error";
import { CreateCheckoutSessionUseCase } from "@/modules/payment/application/use-cases/create-checkout-session.use-case";
import { CalculatePriceVariationUseCase } from "@/modules/price-variation/application/use-cases/calculate-price-variation.use-case";
import { ServiceRepository } from "@/modules/service/domain/repositories/service.repository";
import { Injectable } from "@nestjs/common";
import { Appointment } from "../../domain/entities/appointment.entity";
import { AppointmentRepository } from "../../domain/repositories/appointment.repository";
import { TimeSlotValidator } from "../../domain/validators/time-slot.validator";
import { AppointmentAvailabilityService } from "../services/appointment-availability.service";

interface CreateAppointmentUseCaseRequest {
	companyId: string;
	serviceId: string;
	animalId: string;
	userId: string;
	date: Date;
}

type CreateAppointmentUseCaseResponse = Either<
	ResourceNotFoundError | Error,
	{ checkoutUrl: string }
>;

@Injectable()
export class CreateAppointmentUseCase {
	constructor(
		private readonly appointmentAvailabilityService: AppointmentAvailabilityService,
		private readonly serviceRepository: ServiceRepository,
		private readonly createCheckoutSession: CreateCheckoutSessionUseCase,
		private readonly calculatePriceVariation: CalculatePriceVariationUseCase,
		private readonly appointmentRepository: AppointmentRepository,
	) {}

	async execute({
		companyId,
		serviceId,
		userId,
		animalId,
		date,
	}: CreateAppointmentUseCaseRequest): Promise<CreateAppointmentUseCaseResponse> {
		// Valida existência do serviço
		const service = await this.serviceRepository.findById(serviceId);
		if (!service) {
			return left(new ResourceNotFoundError("Service"));
		}

		const startDate = new Date(date);
		const serviceDuration = service.duration || 0;
		const endDate = new Date(startDate.getTime() + serviceDuration * 60000);

		// Verifica se o horário está disponível
		const { isAvailable, timeRange } =
			await this.appointmentAvailabilityService.getAvailability(
				companyId,
				serviceId,
				startDate,
				serviceDuration,
			);
		if (!isAvailable || !timeRange) {
			return left(new ResourceNotFoundError("Company availability"));
		}

		// Valida se o horário do agendamento está dentro do range disponível
		const { startTime, endTime } = timeRange;

		if (
			!TimeSlotValidator.isValid(startDate, serviceDuration, startTime, endTime)
		) {
			return left(new Error("Invalid time slot"));
		}

		// Calcula variação de preço
		const priceResult = await this.calculatePriceVariation.execute({
			animalId,
			serviceId,
		});
		if (priceResult.isLeft()) {
			return left(priceResult.value);
		}

		// Cria a entidade de agendamento
		const appointment = Appointment.create({
			animalId,
			clientId: userId,
			companyId: service.companyId.toString(),
			startDate,
			endDate,
			serviceId: service.id.toString(),
			priceAtScheduling: priceResult.value.price,
		});
		// Cria sessão de checkout
		const checkoutResult = await this.createCheckoutSession.execute({
			item: {
				amount: priceResult.value.price,
				name: service.name,
			},
			cancelUrl: `${process.env.APP_URL}/cancel`,
			payerId: userId,
			successUrl: `${process.env.APP_URL}/success`,
			metadata: {
				companyId,
				serviceId,
				startDate: startDate.toISOString(),
				endDate: endDate.toISOString(),
			},
		});
		if (checkoutResult.isLeft()) {
			return left(checkoutResult.value);
		}

		// Persiste o agendamento com o ID do pagamento
		await this.appointmentRepository.create(
			appointment,
			checkoutResult.value.paymentId,
		);

		return right({
			checkoutUrl: "checkoutResult.value.url",
		});
	}
}
