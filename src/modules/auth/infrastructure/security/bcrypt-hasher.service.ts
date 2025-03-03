import { hash, compare } from 'bcrypt'
import { HashGenerator } from '../../domain/interfaces/hash-generator.interface'
import { HashComparer } from '../../domain/interfaces/hash-comparer.interface'
import { Injectable } from '@nestjs/common'

@Injectable()
export class BcryptHasher implements HashGenerator, HashComparer {
  private HASH_SALT_LENGTH = 8

  hash(plain: string): Promise<string> {
    return hash(plain, this.HASH_SALT_LENGTH)
  }

  compare(plain: string, hash: string): Promise<boolean> {
    return compare(plain, hash)
  }
}