import { beforeEach, describe, expect, it } from "bun:test";
import { makeAnimal } from "test/factories/make-animal";
import { makeAppointment } from "test/factories/make-appointment";
import { makeCompany } from "test/factories/make-company";
import { makeService } from "test/factories/make-service";
import { makeStaff } from "test/factories/make-staff";
import { makeUser } from "test/factories/make-user";
import { InMemoryUserRepository } from "test/repositories/in-memory-user.repository";
import { ListCompanyClientsUseCase } from "./list-company-clients.use-case";

let inMemoryUsersRepository: InMemoryUserRepository;
let sut: ListCompanyClientsUseCase;

describe("List company clients", () => {
	beforeEach(() => {
		inMemoryUsersRepository = new InMemoryUserRepository();
		sut = new ListCompanyClientsUseCase(inMemoryUsersRepository);
	});

	it("should list clients that have appointments with the company", async () => {
		// Arrange
		const company = makeCompany({});
		const service = makeService({ companyId: company.id });
		const staff = makeStaff({ companyId: company.id });

		const client1 = makeUser({ type: "customer" });
		const client2 = makeUser({ type: "customer" });
		const client3 = makeUser({ type: "customer" });

		const animal1 = makeAnimal({ userId: client1.id });
		const animal2 = makeAnimal({ userId: client2.id });

		// Create appointments for clients 1 and 2 with the company
		const appointment1 = makeAppointment({
			companyId: company.id,
			clientId: client1.id,
			serviceId: service.id,
			staffId: staff.id,
			animalId: animal1.id,
		});

		const appointment2 = makeAppointment({
			companyId: company.id,
			clientId: client2.id,
			serviceId: service.id,
			staffId: staff.id,
			animalId: animal2.id,
		});

		// Add users and appointments to repositories
		inMemoryUsersRepository.create(client1);
		inMemoryUsersRepository.create(client2);
		inMemoryUsersRepository.create(client3);

		// Add appointments to the repository
		inMemoryUsersRepository.appointments.push({
			id: appointment1.id.toString(),
			companyId: company.id.toString(),
			clientId: client1.id.toString(),
			startDate: appointment1.startDate,
		});

		inMemoryUsersRepository.appointments.push({
			id: appointment2.id.toString(),
			companyId: company.id.toString(),
			clientId: client2.id.toString(),
			startDate: appointment2.startDate,
		});

		// Act
		const result = await sut.execute({
			companyId: company.id.toString(),
			query: {
				page: 1,
				limit: 10,
			},
		});

		// Assert
		expect(result.isRight()).toBe(true);
		if (result.isRight()) {
			expect(result.value.clients.items).toHaveLength(2);
		}
	});

	it("should return empty list when no clients have appointments with the company", async () => {
		// Arrange
		const company = makeCompany({});
		const client = makeUser({ type: "customer" });

		inMemoryUsersRepository.create(client);

		// Act
		const result = await sut.execute({
			companyId: company.id.toString(),
			query: {
				page: 1,
				limit: 10,
			},
		});

		// Assert
		expect(result.isRight()).toBe(true);
		if (result.isRight()) {
			expect(result.value.clients.items).toHaveLength(0);
		}
	});

	it("should filter clients by search query", async () => {
		// Arrange
		const company = makeCompany({});
		const service = makeService({ companyId: company.id });
		const staff = makeStaff({ companyId: company.id });

		const client1 = makeUser({ type: "customer", name: "João Silva" });
		const client2 = makeUser({ type: "customer", name: "Maria Santos" });

		const animal1 = makeAnimal({ userId: client1.id });
		const animal2 = makeAnimal({ userId: client2.id });

		const appointment1 = makeAppointment({
			companyId: company.id,
			clientId: client1.id,
			serviceId: service.id,
			staffId: staff.id,
			animalId: animal1.id,
		});

		const appointment2 = makeAppointment({
			companyId: company.id,
			clientId: client2.id,
			serviceId: service.id,
			staffId: staff.id,
			animalId: animal2.id,
		});

		inMemoryUsersRepository.create(client1);
		inMemoryUsersRepository.create(client2);

		// Add appointments to the repository
		inMemoryUsersRepository.appointments.push({
			id: appointment1.id.toString(),
			companyId: company.id.toString(),
			clientId: client1.id.toString(),
			startDate: appointment1.startDate,
		});

		inMemoryUsersRepository.appointments.push({
			id: appointment2.id.toString(),
			companyId: company.id.toString(),
			clientId: client2.id.toString(),
			startDate: appointment2.startDate,
		});

		// Act
		const result = await sut.execute({
			companyId: company.id.toString(),
			query: {
				page: 1,
				limit: 10,
				search: "João",
			},
		});

		// Assert
		expect(result.isRight()).toBe(true);
		if (result.isRight()) {
			expect(result.value.clients.items).toHaveLength(1);
			expect(result.value.clients.items[0]).toMatchObject(
				expect.objectContaining({
					id: client1.id.toString(),
					name: "João Silva",
				}),
			);
		}
	});
});
