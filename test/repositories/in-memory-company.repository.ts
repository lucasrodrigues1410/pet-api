import { Company } from "src/modules/company/domain/entities/company.entity";
import { makeLocation } from "test/factories/make-location";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { Asset } from "@/modules/asset/domain/entities/asset";
import { CompanyRepository } from "@/modules/company/domain/repositories/company.repository";
import { Location } from "@/modules/location/domain/entities/location";
import { paginate } from "@/shared/utils/paginator";

export class InMemoryCompanyRepository implements CompanyRepository {
	public items: Company[] = [];
	public locations: Location[] = [];
	public images: Asset[] = [];

	private createDefaultLocation(): Location {
		return makeLocation();
	}

	async findById(id: string) {
		const company = this.items.find((c) => c.id.toString() === id);
		if (!company) return null;

		// Busca o endereço associado à empresa ou cria um padrão
		const locationData = this.locations.find((loc) => loc.id.toString() === id);
		const address = locationData || this.createDefaultLocation();

		// Cria um novo objeto sem modificar o original
		const companyWithExtras = {
			...company,
			availabilities: [],
			images: [],
			services: [],
			address,
		};

		return companyWithExtras as any;
	}

	async searchCompanies(
		params: Parameters<CompanyRepository["searchCompanies"]>[0],
	) {
		const { query, location, ...paginationParams } = params;

		let filteredItems = this.items;

		// Filtro por query
		if (query) {
			filteredItems = filteredItems.filter(
				(company) =>
					company.name.toLowerCase().includes(query.toLowerCase()) ||
					company.description?.toLowerCase().includes(query.toLowerCase()),
			);
		}

		// Filtro por localização (simplificado para testes)
		if (location) {
			const companiesInLocation = this.locations
				.filter((loc) => {
					const distance = Math.sqrt(
						(loc.latitude - location.latitude) ** 2 +
							(loc.longitude - location.longitude) ** 2,
					);
					return distance <= (location.radiusInKm || 10) / 111; // Conversão aproximada
				})
				.map((loc) => loc.id.toString());

			filteredItems = filteredItems.filter((company) =>
				companiesInLocation.includes(company.id.toString()),
			);
		}

		// Mapeia para o formato esperado
		const companiesWithDetails = filteredItems.map((company) => {
			const companyLocation = this.locations.find(
				(loc) => loc.id.toString() === company.id.toString(),
			);
			const companyImage = this.images.find(
				(img) => img.id.toString() === company.id.toString(),
			);

			// Cria um objeto que preserva os getters da Company e adiciona address e image
			const companyWithExtras = Object.create(Object.getPrototypeOf(company));
			Object.assign(companyWithExtras, company);
			companyWithExtras.address =
				companyLocation || this.createDefaultLocation();
			companyWithExtras.image =
				companyImage ||
				Asset.create({
					fileId: new UniqueEntityID().toString(),
					fileType: "image/png",
					height: 100,
					name: "default.png",
					thumbnailUrl: "https://example.com/default-thumb.png",
					url: "https://example.com/default.png",
					width: 100,
					userId: new UniqueEntityID(),
				});

			return companyWithExtras;
		});

		return paginate(
			async ({ skip, take }) => {
				return companiesWithDetails.slice(skip, skip + take);
			},
			async () => companiesWithDetails.length,
			paginationParams,
		);
	}

	async update(id: string, data: Partial<Company>) {
		const companyIndex = this.items.findIndex((c) => c.id.toString() === id);
		if (companyIndex === -1)  throw new Error("Company not found");
		this.items[companyIndex] = Company.create(
			{
				name: data.name || this.items[companyIndex].name,
				locationId: data.locationId || this.items[companyIndex].locationId,
				logo: data.logo || this.items[companyIndex].logo,
				averageRating:
					data.averageRating || this.items[companyIndex].averageRating,
				ratingCount: data.ratingCount || this.items[companyIndex].ratingCount,
				contact: data.contact || this.items[companyIndex].contact,
				description: data.description || this.items[companyIndex].description,
			},
			this.items[companyIndex].id,
		);
	}
}
