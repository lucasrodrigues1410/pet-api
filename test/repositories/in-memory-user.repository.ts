import { User } from "src/modules/user/domain/entities/user.entity";
import { UserRepository } from "src/modules/user/domain/repositories/user.repository";
import { PaginationResult } from "@/shared/utils/pagination";
import type { PaginationQuery } from "@/shared/utils/pagination-query";

export class InMemoryUserRepository implements UserRepository {
	public items: User[] = [];
	public appointments: any[] = []; // Mock appointments for testing

	findByEmail(email: string): Promise<User | null> {
		return Promise.resolve(
			this.items.find((user) => user.email === email) || null,
		);
	}
	findById(id: string): Promise<User | null> {
		return Promise.resolve(
			this.items.find((user) => user.id.toString() === id) || null,
		);
	}
	create(user: User): Promise<void> {
		this.items.push(user);
		return Promise.resolve();
	}
	update(user: User): Promise<void> {
		const index = this.items.findIndex((item) => item.id === user.id);
		this.items[index] = user;
		return Promise.resolve();
	}

	async findClientsByCompanyId(params: {
		companyId: string;
		query: PaginationQuery & {
			search?: string;
		};
	}): Promise<PaginationResult<User & { appointmentsCount: number; lastAppointmentDate: Date | null }>> {
		const { companyId, query } = params;
		const { page, limit, search } = query;

		// Filter clients that have appointments with the company
		const clientsWithAppointments = this.items.filter((user) => {
			if (user.type !== "customer") return false;
			
			const hasAppointment = this.appointments.some(
				(appointment) => 
					appointment.clientId === user.id.toString() && 
					appointment.companyId === companyId
			);
			
			if (!hasAppointment) return false;
			
			if (search) {
				return user.name.toLowerCase().includes(search.toLowerCase()) ||
					   user.email.toLowerCase().includes(search.toLowerCase());
			}
			
			return true;
		});

		const total = clientsWithAppointments.length;
		const totalPages = Math.ceil(total / (limit ?? 1));
		const startIndex = ((page ?? 1) - 1) * (limit ?? 1);
		const endIndex = startIndex + (limit ?? 1);
		const paginatedClients = clientsWithAppointments.slice(startIndex, endIndex);

		const clientsWithAppointmentData = paginatedClients.map((client) => {
			const clientAppointments = this.appointments.filter(
				(appointment) => 
					appointment.clientId === client.id.toString() && 
					appointment.companyId === companyId
			);
			
			const lastAppointment = clientAppointments
				.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())[0];

			return Object.assign(client, {
					appointmentsCount: clientAppointments.length,
					lastAppointmentDate: lastAppointment ? new Date(lastAppointment.startDate) : null,
				});
			});
			

		return {
			items:clientsWithAppointmentData,
			meta: {
				page: page ?? 1,
				limit: limit ?? 1,
				total,
				totalPages,
			},
		};
	}
}
