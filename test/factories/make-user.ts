import { faker } from "@faker-js/faker";
import { User, UserProps } from "src/modules/user/domain/entities/user.entity";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";

export function makeUser(
	override: Partial<UserProps & { id?: UniqueEntityID }> = {},
) {
	const user = User.create(
		{
			email: override.email ?? faker.internet.email(),
			name: override.name ?? faker.person.fullName(),
			password: override.password ?? faker.internet.password(),
			type:
				override.type ??
				faker.helpers.arrayElement(["customer", "admin", "company"]),
			avatarAssetId: override.avatarAssetId,
			avatar: override.avatar,
		},
		override.id,
	);

	return user;
}