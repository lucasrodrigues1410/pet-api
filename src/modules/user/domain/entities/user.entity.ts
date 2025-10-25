import { Entity } from "@/core/domain/entities/entity";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
export interface UserProps {
	email: string;
	name: string;
	password?: string;
	authProviderId?: string;
	avatarUrl?: string;
}

export class User extends Entity<UserProps> {
	get email() {
		return this.props.email;
	}

	get name() {
		return this.props.name;
	}

	get password(): string | undefined {
		return this.props.password;
	}

	get authProviderId() {
		return this.props.authProviderId;
	}

	get avatarUrl() {
		return this.props.avatarUrl;
	}

	set email(email: string) {
		this.props.email = email;
	}

	set name(name: string) {
		this.props.name = name;
	}

	set password(password: string) {
		this.props.password = password;
	}

	public static create(props: UserProps, id?: UniqueEntityID): User {
		const user = new User(props, id);
		return user;
	}
}
