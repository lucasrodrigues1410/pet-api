import { Asset } from "@/modules/asset/domain/entities/asset";
import { AssetPresenter } from "@/modules/asset/infra/http/presenters/asset.presenter";
import { Company } from "@/modules/company/domain/entities/company.entity";
import { CompanyAvailability } from "@/modules/company-availability/domain/entities/company-availability.entity";
import { CompanyAvailabilityPresenter } from "@/modules/company-availability/infra/http/presenters/company-availability.presenter";
import { Location } from "@/modules/location/domain/entities/location";
import { Service } from "@/modules/service/domain/entities/service.entity";
import { ServicePresenter } from "@/modules/service/infra/http/presenters/service.presenter";

export class CompanyPresenter {
	static presentBasic(company: Company) {
		return {
			id: company.id.toString(),
			name: company.name,
			contact: company.contact,
			description: company.description,
			logo: company.logo ? AssetPresenter.present(company.logo) : undefined,
			logoAssetId: company.logoAssetId?.toString(),
			locationId: company.locationId.toString(),
			averageRating: company.averageRating,
			ratingCount: company.ratingCount,
		};
	}

	static presentWithAddress(company: Company, address: Location) {
		return {
			...this.presentBasic(company),
			address: {
				id: address.id.toString(),
				addressLine: address.addressLine,
				number: address.number,
				complement: address.complement,
				neighborhood: address.neighborhood,
				city: address.city,
				state: address.state,
				country: address.country,
				postalCode: address.postalCode,
				latitude: address.latitude,
				longitude: address.longitude,
			},
		};
	}

	static presentWithAddressAndImage(
		company: Company,
		address: Location,
		image?: Asset,
	) {
		return {
			...this.presentWithAddress(company, address),
			image: image ? AssetPresenter.present(image) : null,
		};
	}

	static presentComplete(
		company: Company,
		address: Location,
		images: Asset[],
		services: Service[],
		availabilities: CompanyAvailability[],
	) {
		return {
			...this.presentBasic(company),
			address: {
				id: address.id.toString(),
				addressLine: address.addressLine,
				number: address.number,
				complement: address.complement,
				neighborhood: address.neighborhood,
				city: address.city,
				state: address.state,
				country: address.country,
				postalCode: address.postalCode,
				latitude: address.latitude,
				longitude: address.longitude,
			},
			images: images.map((image) => AssetPresenter.present(image)),
			services: services.map((service) => ServicePresenter.present(service)),
			availabilities: availabilities.map((availability) =>
				CompanyAvailabilityPresenter.present(availability),
			),
		};
	}
}
