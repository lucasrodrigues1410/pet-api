import { SetMetadata } from "@nestjs/common";
import { UserType as UserTypeEnum } from "src/modules/user/domain/entities/user.entity";

export const USER_TYPE_KEY = "user_type";
export const UserType = (...userTypes: UserTypeEnum[]) =>
	SetMetadata(USER_TYPE_KEY, userTypes);
