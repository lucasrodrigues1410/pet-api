export type  UserType =  "CUSTOMER" | "COMPANY" | "ADMIN";

export class User {
	id!: number;
	email!: string;
	name: string;
	password?: string;
	type!: UserType;
	createdAt!: Date;
	updatedAt!: Date;
	deletedAt?: Date | null;
}
