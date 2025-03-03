import { ApiProperty } from "@nestjs/swagger";
import { UserType } from "../../domain/entities/user.entity";

export class UserResponseDto {
	@ApiProperty()
	id: number;

	@ApiProperty()
	name: string;

	@ApiProperty()
	email: string;

	@ApiProperty({
		enum: ["CUSTOMER", "COMPANY", "ADMIN"],
	})
	type: UserType;

	@ApiProperty()
	createdAt: Date;

	@ApiProperty()
	updatedAt: Date;
}
