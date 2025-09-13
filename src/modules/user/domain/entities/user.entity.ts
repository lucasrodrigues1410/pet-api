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

	set password(password: string) {
		this.props.password = password;
	}

	public static create(props: UserProps, id?: UniqueEntityID): User {
		const user = new User(props, id);
		return user;
	}
}
