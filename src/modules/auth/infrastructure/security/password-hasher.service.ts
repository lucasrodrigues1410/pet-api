import * as bcrypt from 'bcrypt';
import { IPasswordHasher } from '../../domain/interfaces/password-hasher.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BcryptPasswordHasher implements IPasswordHasher {
  async comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }
}