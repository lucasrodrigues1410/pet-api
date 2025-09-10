import { beforeEach, describe, expect, it, jest } from "bun:test";
import { Test } from "@nestjs/testing";
import { makeAnimal } from "test/factories/make-animal";
import { makeAppointment } from "test/factories/make-appointment";
import { makeCompany } from "test/factories/make-company";
import { makeService } from "test/factories/make-service";
import { makeStaff } from "test/factories/make-staff";
import { makeUser } from "test/factories/make-user";
import { UserRepository } from "../../domain/repositories/user.repository";
import { ListCompanyClientsUseCase } from "./list-company-clients.use-case";

let sut: ListCompanyClientsUseCase;
let moduleRef: any;

const mockUserRepository = { findClientsByCompanyId: jest.fn() };

describe("List company clients", () => {
	beforeEach(async () => {
		mockUserRepository.findClientsByCompanyId.mockReset();
		moduleRef = await Test.createTestingModule({
			providers: [
				ListCompanyClientsUseCase,
				{ provide: UserRepository, useValue: mockUserRepository },
			],
		}).compile();
		sut = moduleRef.get(ListCompanyClientsUseCase);
	});

	it("should list clients that have appointments with the company", async () => {
		// Arrange
		const company = makeCompany({});
		const service = makeService({ companyId: company.id });
		const staff = makeStaff({ companyId: company.id });

		const client1 = makeUser({ type: "customer" });
		const client2 = makeUser({ type: "customer" });
		/* const client3 = makeUser({ type: "customer" }); */

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

		mockUserRepository.findClientsByCompanyId.mockResolvedValue({
			items: [
				{
					id: client1.id.toString(),
					name: client1.name,
					email: client1.email,
					appointmentsCount: 1,
					lastAppointmentDate: appointment1.startDate,
				},
				{
					id: client2.id.toString(),
					name: client2.name,
					email: client2.email,
					appointmentsCount: 1,
					lastAppointmentDate: appointment2.startDate,
				},
			],
			total: 2,
			page: 1,
			limit: 10,
		});

		// Act
		const result = await sut.execute({
			companyId: company.id.toString(),
			query: { page: 1, limit: 10 },
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
		/* const client = makeUser({ type: "customer" }); */

		mockUserRepository.findClientsByCompanyId.mockResolvedValue({
			items: [],
			total: 0,
			page: 1,
			limit: 10,
		});

		// Act
		const result = await sut.execute({
			companyId: company.id.toString(),
			query: { page: 1, limit: 10 },
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

		mockUserRepository.findClientsByCompanyId.mockImplementation(
			async ({ query }) => {
				const search = query?.search ?? "";
				const source = [
					{
						id: client1.id.toString(),
						name: client1.name,
						email: client1.email,
						appointmentsCount: 1,
						lastAppointmentDate: appointment1.startDate,
					},
					{
						id: client2.id.toString(),
						name: client2.name,
						email: client2.email,
						appointmentsCount: 1,
						lastAppointmentDate: appointment2.startDate,
					},
				];
				const filtered = source.filter((c) => c.name.includes(search));
				return { items: filtered, total: filtered.length, page: 1, limit: 10 };
			},
		);

		// Act
		const result = await sut.execute({
			companyId: company.id.toString(),
			query: { page: 1, limit: 10, search: "João" },
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
