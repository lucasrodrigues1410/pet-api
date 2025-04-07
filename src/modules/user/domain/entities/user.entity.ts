import { Entity } from "@/core/domain/entities/entity";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";

export type UserType = "CUSTOMER" | "COMPANY" | "ADMIN";

export interface UserProps {
	email: string;
	name: string;
	password: string;
	type: UserType;
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

	public static create(props: UserProps, id?: UniqueEntityID): User {
		const user = new User(props, id);
		return user;
	}
}
