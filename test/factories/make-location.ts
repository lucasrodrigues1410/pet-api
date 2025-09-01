import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/core/infra/prisma/prisma.service";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { Location, LocationProps } from "@/modules/location/domain/entities/location";
import { PrismaLocationMapper } from "@/modules/location/infra/database/mappers/prisma-location.mapper";

export function makeLocation(
	override: Partial<Location> = {},
	id?: UniqueEntityID,
) {
	const location = Location.create(
		{
			addressLine: faker.location.streetAddress(),
			number: faker.number.int({ min: 1, max: 1000 }).toString(),
			complement: faker.lorem.sentence(),
			neighborhood: faker.location.city(),
			city: faker.location.city(),
			state: faker.location.state(),
			country: faker.location.country(),
			postalCode: faker.location.zipCode(),
			latitude: faker.number.float({ min: -90, max: 90 }),
			longitude: faker.number.float({ min: -180, max: 180 }),
			...override,
		},
		id,
	);

	return location;
}

@Injectable()
export class LocationFactory {
	constructor(private prisma: PrismaService) {}

	async makePrismaLocation(data: Partial<LocationProps> = {}): Promise<Location> {
		const location = makeLocation(data);

		await this.prisma.location.create({
			data: PrismaLocationMapper.toPrisma(location),
		});

		return location;
	}
}
