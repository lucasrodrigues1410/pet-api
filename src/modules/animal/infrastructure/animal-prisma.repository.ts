import { Injectable } from "@nestjs/common";
import { IAnimalRepository } from "../domain/repositories/animal.repository";
import { PrismaService } from "src/common/infrastructure/prisma/prisma.service";
import { Animal } from "../domain/entities/animal.entity";

@Injectable()
export class AnimalPrismaRepository implements IAnimalRepository {
	constructor(private prismaService: PrismaService) {}

	async createAnimal(pet: Animal) {
		return this.prismaService.animal.create({
			data: pet,
		});
	}

	async updateAnimal({
		id,
		data,
	}: {
		id: number;
		data: Partial<Omit<Animal, "id" | "userId">>;
	}) {
		await this.prismaService.animal.update({
			where: { id },
			data,
		});
	}

	async getAnimalById(petId: number): Promise<Animal | null> {
		const response = await this.prismaService.animal.findUnique({
			where: { id: petId },
		});
		return response;
	}

	async deleteAnimal(petId: number) {
		await this.prismaService.animal.delete({ where: { id: petId } });
	}

	async getAnimalsByUser(userId: number) {
		const response = await this.prismaService.animal.findMany({
			where: { userId },
		});

		return response;
	}
}
