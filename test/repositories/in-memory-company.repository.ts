import { Company } from "src/modules/company/domain/entities/company.entity";
import { CompanyRepository } from "src/modules/company/domain/repositories/company.repository";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { paginate } from "@/shared/utils/paginator";

export class InMemoryCompanyRepository implements CompanyRepository {
	public items: Company[] = [];
	private owners = new Map<string, string>();
	private deleted = new Set<string>();

	async findById(id: string): Promise<Company | null> {
		const company = this.items.find((c) => c.id.toString() === id);
		if (!company) return null;
		if (this.deleted.has(id)) return null;
		return company;
	}

	searchCompanies(params: Parameters<CompanyRepository["searchCompanies"]>[0]) {
		return paginate(
			async () =>
				this.items.filter(
					(company) =>
						!this.deleted.has(company.id.toString()) &&
						company.name.includes(params.query || ""),
				),
			async () =>
				this.items.filter((c) => !this.deleted.has(c.id.toString())).length,
			params,
		);
	}

	async create(company: Company, ownerUserId: string): Promise<void> {
		this.items.push(company);
		this.owners.set(company.id.toString(), ownerUserId);
	}

	async update(
		companyId: string,
		data: { name?: string; address?: string; contact?: string },
	): Promise<Company> {
		const index = this.items.findIndex((c) => c.id.toString() === companyId);
		if (index === -1 || this.deleted.has(companyId)) {
			throw new Error("Company not found");
		}
		const current = this.items[index];
		const updated = Company.create(
			{
				name: data.name ?? current.name,
				address: data.address ?? current.address,
				contact: data.contact ?? current.contact,
			},
			new UniqueEntityID(current.id.toString()),
		);
		this.items[index] = updated;
		return updated;
	}

	async softDelete(companyId: string): Promise<void> {
		this.deleted.add(companyId);
	}

	async isOwner(params: {
		companyId: string;
		userId: string;
	}): Promise<boolean> {
		return this.owners.get(params.companyId) === params.userId;
	}

	async findByUserId(userId: string): Promise<Company | null> {
		return this.items.find((c) => c.staff?.some((u) => u.id.toString() === userId)) ?? null;
	}
}
