import { HttpException, HttpStatus } from '@nestjs/common';

export class NotFoundException extends HttpException {
  constructor(message?: string) {
    super(message || 'Recurso não encontrado', HttpStatus.NOT_FOUND);
  }
}