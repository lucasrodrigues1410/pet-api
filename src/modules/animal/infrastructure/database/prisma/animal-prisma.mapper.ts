import { Prisma, Animal as PrismaAnimal,Breed as PrismaBreed } from "@prisma/client";
import { Animal } from "src/modules/animal/domain/entities/animal.entity";
import { Breed } from "src/modules/breed/domain/entities/breed.entity";

export class AnimalPrismaMapper {
    static toDomain(prismaAnimal: PrismaAnimal & { breed?: PrismaBreed }): Animal {
        const breed = prismaAnimal.breed
            ? Breed.create(
                  {
                      animalTypeId: prismaAnimal.breed.animalTypeId,
                      name: prismaAnimal.breed.name,
                  },
                  prismaAnimal.breed.id
              )
            : undefined;

        return Animal.create({
            userId: prismaAnimal.userId,
            breedId: prismaAnimal.breedId,
            name: prismaAnimal.name,
            birthdate: prismaAnimal.birthdate,
            weight: prismaAnimal.weight,
            breed
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