import { Entity } from "@/core/domain/entities/entity";
import type { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { Asset } from "@/modules/asset/domain/entities/asset";

export interface CompanyImageProps {
	companyId: string;
	asset: Asset;
}

export class CompanyImage extends Entity<CompanyImageProps> {
	get companyId() {
		return this.props.companyId;
	}

	get asset() {
		return this.props.asset;
	}

	public static create(
		props: CompanyImageProps,
		id?: UniqueEntityID,
	): CompanyImage {
		return new CompanyImage(props, id);
	}

	public toObject() {
		return {
			id: this.id.toString(),
			asset: this.asset.toObject(),
		};
	}
}
