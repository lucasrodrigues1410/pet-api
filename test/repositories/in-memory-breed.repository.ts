import { Breed } from "src/modules/breed/domain/entities/breed.entity";
import { BreedRepository, FindBreedsParams } from "src/modules/breed/domain/repositories/breed.repository";
import { paginate } from "@/shared/utils/paginator";

export class InMemoryBreedRepository implements BreedRepository {
	public items: Breed[] = [];

	async getAll(params: FindBreedsParams) {
		// Filtra por query se fornecida
		let filteredItems = this.items;
		if (params.query) {
			filteredItems = this.items.filter(breed => 
				breed.name.toLowerCase().includes(params.query!.toLowerCase())
			);
		}

		// Retorna todos os itens filtrados (sem paginação para manter compatibilidade com a interface)
		return filteredItems;
	}

	async findById(id: string) {
		const breed = this.items.find((item) => item.id.toString() === id);
		return breed ?? null;
	}

	async create(breed: Breed): Promise<void> {
		this.items.push(breed);
		await Promise.resolve();
	}

	// Método auxiliar para paginação se necessário nos testes
	async getAllPaginated(params: { page?: number; limit?: number; query?: string }) {
		const { page, limit, query } = params;
		
		// Filtra por query se fornecida
		let filteredItems = this.items;
		if (query) {
			filteredItems = this.items.filter(breed => 
				breed.name.toLowerCase().includes(query.toLowerCase())
			);
		}

		const result = await paginate(
			async ({ skip, take }) => filteredItems.slice(skip, skip + take),
			async () => filteredItems.length,
			{ page, limit },
		);
		
		return result;
	}
}
