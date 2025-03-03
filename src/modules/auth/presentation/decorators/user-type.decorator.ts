import { SetMetadata } from '@nestjs/common';
import { UserType } from 'src/modules/user/domain/entities/user.entity';

export const USER_TYPE_KEY = 'userType';
export const UserTypeDecorator = (...userTypes: UserType[]) => SetMetadata(USER_TYPE_KEY, userTypes);
