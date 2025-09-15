import { Animal } from "@/modules/animal/domain/entities/animal.entity";
import { Appointment } from "@/modules/appointment/domain/entities/appointment.entity";
import { Asset } from "@/modules/asset/domain/entities/asset";
import { AssetPresenter } from "@/modules/asset/infra/http/presenters/asset.presenter";
import { Breed } from "@/modules/breed/domain/entities/breed.entity";
import { Company } from "@/modules/company/domain/entities/company.entity";
import { Service } from "@/modules/service/domain/entities/service.entity";
import { ServicePresenter } from "@/modules/service/infra/http/presenters/service.presenter";
import { User } from "@/modules/user/domain/entities/user.entity";

export class AppointmentPresenter {
	static presentBasic(appointment: Appointment) {
		return {
			id: appointment.id.toString(),
			animalId: appointment.animalId.toString(),
			staffId: appointment.staffId.toString(),
			serviceId: appointment.serviceId.toString(),
			companyId: appointment.companyId.toString(),
			startDate: appointment.startDate.toISOString(),
			endDate: appointment.endDate.toISOString(),
			status: appointment.status,
			price: appointment.price,
			coatType: appointment.coatType,
			clientId: appointment.clientId.toString(),
		};
	}

	static presentWithAnimalAndBreed(
		appointment: Appointment,
		animal: Animal,
		breed: Breed,
	) {
		return {
			...this.presentBasic(appointment),
			animal: {
				id: animal.id.toString(),
				userId: animal.userId.toString(),
				breedId: animal.breedId.toString(),
				name: animal.name,
				age: animal.age,
				weight: animal.weight,
				assetId: animal.assetId?.toString(),
				size: animal.size,
				ageStage: animal.ageStage,
				breed: {
					id: breed.id.toString(),
					animalTypeId: breed.animalTypeId.toString(),
					name: breed.name,
				},
			},
		};
	}

	static presentWithAnimalBreedAndAsset(
		appointment: Appointment,
		animal: Animal,
		breed: Breed,
		asset?: Asset,
	) {
		return {
			...this.presentWithAnimalAndBreed(appointment, animal, breed),
			animal: {
				...this.presentWithAnimalAndBreed(appointment, animal, breed).animal,
				asset: asset ? AssetPresenter.present(asset) : undefined,
			},
		};
	}

	static presentWithClient(appointment: Appointment, client: User) {
		return {
			...this.presentBasic(appointment),
			client: {
				id: client.id.toString(),
				email: client.email,
				name: client.name,
				type: client.type,
				avatar: client.avatar
					? AssetPresenter.present(client.avatar)
					: undefined,
				avatarAssetId: client.avatarAssetId,
			},
		};
	}

	static presentWithService(appointment: Appointment, service: Service) {
		return {
			...this.presentBasic(appointment),
			service: ServicePresenter.present(service),
		};
	}

	static presentWithCompany(appointment: Appointment, company: Company) {
		return {
			...this.presentBasic(appointment),
			company: {
				id: company.id.toString(),
				name: company.name,
				contact: company.contact,
				description: company.description,
				logo: company.logo ? AssetPresenter.present(company.logo) : undefined,
				logoAssetId: company.logoAssetId,
				locationId: company.locationId.toString(),
				averageRating: company.averageRating,
				ratingCount: company.ratingCount,
			},
		};
	}

	static presentComplete(
		appointment: Appointment,
		animal: Animal & { breed: Breed; asset?: Asset },
		client: User,
		service: Service,
		company: Company,
	) {
		return {
			...this.presentBasic(appointment),
			animal: {
				id: animal.id.toString(),
				userId: animal.userId.toString(),
				breedId: animal.breedId.toString(),
				name: animal.name,
				age: animal.age,
				weight: animal.weight,
				assetId: animal.assetId?.toString(),
				size: animal.size,
				ageStage: animal.ageStage,
				breed: {
					id: animal.breed.id.toString(),
					animalTypeId: animal.breed.animalTypeId.toString(),
					name: animal.breed.name,
				},
				asset: animal.asset ? AssetPresenter.present(animal.asset) : undefined,
			},
			client: {
				id: client.id.toString(),
				email: client.email,
				name: client.name,
				type: client.type,
				avatar: client.avatar
					? AssetPresenter.present(client.avatar)
					: undefined,
				avatarAssetId: client.avatarAssetId,
			},
			service: ServicePresenter.present(service),
			company: {
				id: company.id.toString(),
				name: company.name,
				contact: company.contact,
				description: company.description,
				logo: company.logo ? AssetPresenter.present(company.logo) : undefined,
				logoAssetId: company.logoAssetId,
				locationId: company.locationId.toString(),
				averageRating: company.averageRating,
				ratingCount: company.ratingCount,
			},
		};
	}
}
