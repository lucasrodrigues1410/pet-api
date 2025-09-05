import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/core/infra/prisma/prisma.service";
import { PaginationResult } from "@/shared/utils/pagination";
import type { PaginationQuery } from "@/shared/utils/pagination-query";
import { paginate } from "@/shared/utils/paginator";
import { User } from "../../../domain/entities/user.entity";
import { UserRepository } from "../../../domain/repositories/user.repository";
import { PrismaUserMapper } from "../mappers/prisma-user.mapper";

@Injectable()
export class PrismaUserRepository implements UserRepository {
	constructor(private readonly prisma: PrismaService) {}

	async findByEmail(email) {
		const response = await this.prisma.user.findFirst({
			where: { email },
			include: {
				avatar: true,
			},
		});

		if (!response) {
			return null;
		}

		return PrismaUserMapper.toDomain(response);
	}

	async findById(id: string): Promise<User | null> {
		const response = await this.prisma.user.findFirst({
			where: { id },
		});

		if (!response) {
			return null;
		}

		return PrismaUserMapper.toDomain(response);
	}

	async create(user: User): Promise<void> {
		const data = PrismaUserMapper.toPrisma(user);
		await this.prisma.user.create({
			data: data,
		});
	}

	async update(user: User): Promise<void> {
		const data = PrismaUserMapper.toPrisma(user);
		await this.prisma.user.update({
			where: { id: user.id.toString() },
			data: data,
		});
	}

	async findClientsByCompanyId(params: {
		companyId: string;
		query: PaginationQuery & {
			search?: string;
		};
	}) {
		const { companyId, query } = params;

		const whereClause = {
			appointments: {
				some: {
					companyId,
				},
			},
			type: "customer" as const,
			...(query.search && {
				OR: [
					{ name: { contains: query.search, mode: "insensitive" as const } },
					{ email: { contains: query.search, mode: "insensitive" as const } },
				],
			}),
		};

		const { items, meta } = await paginate(
			({ skip, take }) =>
				this.prisma.user.findMany({
					where: whereClause,
					include: {
						avatar: true,
						_count: {
							select: {
								appointment: {
									where: {
										companyId,
									},
								},
							},
						},
						appointment: {
							orderBy: {
								createdAt: "desc",
							},
							take: 1,
						},
					},
					skip,
					take,
				}),
			() => this.prisma.user.count({ where: whereClause }),
			query,
		);

		return {
			items: items.map((item) => {
				return {
					...PrismaUserMapper.toDomain(item),
					appointmentsCount: item._count.appointment,
					lastAppointmentDate: item.appointment[0].startDate,
				};
			}),
			meta,
		} as PaginationResult<
			User & { appointmentsCount: number; lastAppointmentDate: Date | null }
		>;
	}
}
