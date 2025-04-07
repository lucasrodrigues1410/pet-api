import { Entity } from "@/core/domain/entities/entity";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";

export interface AssetProps {
	name: string;
	url: string;
	fileType?: string;
	width?: number;
	height?: number;
	thumbnailUrl?: string;
}

export class Asset extends Entity<AssetProps> {
	get name() {
		return this.props.name;
	}

	get url() {
		return this.props.url;
	}

	get fileType() {
		return this.props.fileType;
	}

	get width() {
		return this.props.width;
	}

	get height() {
		return this.props.height;
	}

	get thumbnailUrl() {
		return this.props.thumbnailUrl;
	}

	public static create(props: AssetProps, id?: UniqueEntityID): Asset {
		return new Asset(props, id);
	}
}
