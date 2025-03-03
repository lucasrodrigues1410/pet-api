import { Prisma, Animal as PrismaAnimal } from "@prisma/client";
import { Animal } from "src/modules/animal/domain/entities/animal.entity";

export class AnimalPrismaMapper {
    static toDomain(prismaAnimal: PrismaAnimal): Animal {
        return Animal.create({
            userId: prismaAnimal.userId,
            breedId: prismaAnimal.breedId,
            name: prismaAnimal.name,
            birthdate: prismaAnimal.birthdate,
            weight: prismaAnimal.weight,
        }, prismaAnimal.id);
    }

    static toPrisma(animal: Animal): Prisma.AnimalUncheckedCreateInput {
        return {
            id: animal.id,
            userId: animal.userId,
            breedId: animal.breedId,
            name: animal.name,
            birthdate: animal.birthdate,
            weight: animal.weight,
        };
    }
}