import { Injectable, NotFoundException } from "@nestjs/common";
import { User } from "../../domain/entities/user.entity";
import { IUserRepository } from "../../domain/repositories/user.repository";

@Injectable()
export class FindUserByIdUseCase {
    constructor(private readonly userRepository: IUserRepository) {}

    async execute(id: number): Promise<User> {
        const response = await this.userRepository.findById(id);

        if (!response) {
            throw new NotFoundException('Usuário não encontrado');
        }

        return response;
    }
}