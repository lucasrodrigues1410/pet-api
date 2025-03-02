export interface IPasswordHasher {
    comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean>;
  }