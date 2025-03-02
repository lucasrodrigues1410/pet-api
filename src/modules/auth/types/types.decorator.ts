import { SetMetadata } from '@nestjs/common';
import { UserRoles } from '../roles/roles';

export const Types = (...args: UserRoles[]) => SetMetadata('types', args);
