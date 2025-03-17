import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/core/infra/prisma/prisma.service";
import { Breed, BreedProps } from "src/modules/breed/domain/entities/breed.entity";
import { BreedPrismaMapper } from "src/modules/breed/infra/database/prisma/mappers/breed.mapper";

export function makeBreed(override: Partial<Breed> = {}, id?: number) {
    const student = Breed.create(
        {
         name: faker.animal.type(),
         animalTypeId: faker.number.int({ min: 1, max: 10 }),
            ...override,
        },
        id,
    );

    return student;
}

@Injectable()
export class BreedFactory {
    constructor(private prisma: PrismaService) {}

    async makePrismaBreed(data: Partial<BreedProps> = {}): Promise<Breed> {
        const breed = makeBreed(data);

        await this.prisma.breed.create({
            data: BreedPrismaMapper.toPrisma(breed),
        });

        return breed;
    }
}