import { Injectable } from "@nestjs/common";
import { addMinutes } from "date-fns";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { Animal } from "@/modules/animal/domain/entities/animal.entity";
import { AnimalRepository } from "@/modules/animal/domain/repositories/animal.repository";
import { CoatType } from "@/modules/appointment/domain/enums/appointment.enum";
import { BreedRepository } from "@/modules/breed/domain/repositories/breed.repository";
import { PriceCalculator } from "@/modules/price-variation/application/services/price-calculator.service";
import { VariationType } from "@/modules/price-variation/domain/entities/price-variation.entity";
import { ServiceRepository } from "@/modules/service/domain/repositories/service.repository";
import { User } from "@/modules/user/domain/entities/user.entity";
import { UserRepository } from "@/modules/user/domain/repositories/user.repository";
import { Either, left, right } from "@/shared/either";
import { ResourceNotFoundError } from "@/shared/errors/errors/resource-not-found.error";
import { Appointment } from "../../../appointment/domain/entities/appointment.entity";
import { AppointmentRepository } from "../../../appointment/domain/repositories/appointment.repository";
import { TimeSlotUnavailableError } from "../errors/time-slot-unavailable.error";
import { AppointmentAvailabilityService } from "../services/appointment-availability.service";

interface CreateAnonymousAppointmentUseCaseRequest {
	serviceId: string;
	companyId: string;
	date: Date;
	coatType: CoatType;
	// Dados do animal
	animal: {
		name: string;
		weight: number;
		breedId: string;
	};
	// Dados do cliente
	client: {
		name: string;
		phone: string;
		email: string;
	};
}

type CreateAnonymousAppointmentUseCaseResponse = Either<
	ResourceNotFoundError | TimeSlotUnavailableError,
	{
		appointmentId: string;
		animalId: string;
		clientId: string;
	}
>;

@Injectable()
export class CreateAnonymousAppointmentUseCase {
	constructor(
		private readonly appointmentAvailabilityService: AppointmentAvailabilityService,
		private readonly serviceRepository: ServiceRepository,
		private readonly priceCalculator: PriceCalculator,
		private readonly breedRepository: BreedRepository,
		private readonly appointmentRepository: AppointmentRepository,
		private readonly userRepository: UserRepository,
		private readonly animalRepository: AnimalRepository,
	) {}

	async execute({
		serviceId,
		companyId,
		date,
		coatType,
		animal,
		client,
	}: CreateAnonymousAppointmentUseCaseRequest): Promise<CreateAnonymousAppointmentUseCaseResponse> {
		// Valida existência do serviço
		const service = await this.serviceRepository.findById(serviceId);
		if (!service) {
			return left(new ResourceNotFoundError("Serviço não encontrado"));
		}

		// Valida se o serviço pertence à empresa
		if (service.companyId.toString() !== companyId) {
			return left(new ResourceNotFoundError("Serviço não pertence à empresa"));
		}

		// Valida existência da raça
		const breed = await this.breedRepository.findById(animal.breedId);
		if (!breed) {
			return left(new ResourceNotFoundError("Raça não encontrada"));
		}

		const startDate = new Date(date);
		const serviceDuration = service.duration || 0;
		const endDate = addMinutes(startDate, serviceDuration);

		// Verifica se o horário está disponível
		const available = await this.appointmentAvailabilityService.getAvailability(
			companyId,
			startDate,
			serviceDuration,
		);
		if (!available.isValid || !available.staffChoiced) {
			return left(new TimeSlotUnavailableError("Horário indisponível"));
		}

		// Cria usuário temporário
		const tempUser = User.create({
			email: client.email,
			name: client.name,
			password: `temp_${Date.now()}`, // Senha temporária
			type: "CUSTOMER",
		});

		await this.userRepository.create(tempUser);

		// Cria animal temporário
		const tempAnimal = Animal.create({
			userId: tempUser.id,
			breedId: new UniqueEntityID(animal.breedId),
			name: animal.name,
			weight: animal.weight,
		});

		await this.animalRepository.create(tempAnimal);

		// Calcula variação de preço
		const price = await this.priceCalculator.calculate(service.id.toString(), [
			{ type: VariationType.SIZE, value: animal.weight },
		]);

		// Cria o agendamento
		const appointmentIntent = Appointment.create({
			serviceId: new UniqueEntityID(serviceId),
			staffId: available.staffChoiced.id,
			animalId: tempAnimal.id,
			clientId: tempUser.id,
			companyId: service.companyId,
			startDate,
			endDate,
			price: price + service.price,
			coatType,
		});

		await this.appointmentRepository.create(appointmentIntent);

		return right({
			appointmentId: appointmentIntent.id.toString(),
			animalId: tempAnimal.id.toString(),
			clientId: tempUser.id.toString(),
		});
	}
}
