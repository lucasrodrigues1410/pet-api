import { Prisma, Location as PrismaLocation } from "prisma/generated/client";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { Location } from "@/modules/location/domain/entities/location";

export class PrismaLocationMapper {
	static toDomain(prismaLocation: PrismaLocation): Location {
		return Location.create(
			{
				addressLine: prismaLocation.addressLine,
				number: prismaLocation.number,
				complement: prismaLocation.complement,
				neighborhood: prismaLocation.neighborhood,
				city: prismaLocation.city,
				state: prismaLocation.state,
				country: prismaLocation.country,
				postalCode: prismaLocation.postalCode,
				latitude: prismaLocation.latitude.toNumber(),
				longitude: prismaLocation.longitude.toNumber(),
			},
			new UniqueEntityID(prismaLocation.id),
		);
	}

	static toPrisma(location: Location): Prisma.LocationUncheckedCreateInput {
		return {
			id: location.id.toString(),
			addressLine: location.addressLine,
			number: location.number,
			complement: location.complement,
			neighborhood: location.neighborhood,
			city: location.city,
			state: location.state,
			country: location.country,
			postalCode: location.postalCode,
			latitude: location.latitude,
			longitude: location.longitude,
		};
	}
}
