export enum UserType {
	CUSTOMER = "CUSTOMER",
	COMPANY = "COMPANY",
	ADMIN = "ADMIN",
}

export class User {
	id!: number;
	email!: string;
	name?: string;
	password!: string;
	type!: UserType;
	createdAt!: Date;
	updatedAt!: Date;
	deletedAt?: Date;
}
