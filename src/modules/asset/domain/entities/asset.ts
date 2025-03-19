import { Entity } from "src/core/entities/entity";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";

export interface AssetProps {
	name: string;
	url: string;
	format?: string;
	alt?: string;
	width?: number;
	height?: number;
	thumbnailUrl?: string;
	formats?: Record<string, unknown>;
	metadata?: Record<string, unknown>;
}

export class Asset extends Entity<AssetProps> {
	get name() {
		return this.props.name;
	}

	get url() {
		return this.props.url;
	}

	get format() {
		return this.props.format;
	}

	get alt() {
		return this.props.alt;
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

	get formats() {
		return this.props.formats;
	}

	get metadata() {
		return this.props.metadata;
	}

	public static create(props: AssetProps, id?: UniqueEntityID): Asset {
		return new Asset(props, id);
	}
}
