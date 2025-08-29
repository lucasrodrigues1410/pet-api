import { Entity } from "@/core/domain/entities/entity";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { Asset } from "@/modules/asset/domain/entities/asset";

export const userType = ["customer", "company", "admin"] as const;
export type UserType = (typeof userType)[number];

export interface UserProps {
	email: string;
	name: string;
	password: string;
	type: UserType;
	avatarAssetId?: string;
	avatar?: Asset;
}

export class User extends Entity<UserProps> {
	get email() {
		return this.props.email;
	}

	get name() {
		return this.props.name;
	}

	get password() {
		return this.props.password;
	}

	get type() {
		return this.props.type;
	}

	get avatar() {
		return this.props.avatar;
	}

	get avatarAssetId() {
		return this.props.avatarAssetId;
	}

	public static create(props: UserProps, id?: UniqueEntityID): User {
		const user = new User(props, id);
		return user;
	}

	public update(data: Partial<UserProps>): void {
		this.props = {
			...this.props,
			...data,
		};
	}

	public toObject() {
		return {
			id: this.id.toString(),
			email: this.email,
			name: this.name,
			type: this.type,
			avatar: this.avatar?.toObject(),
			avatarAssetId: this.avatarAssetId,
		};
	}
}
