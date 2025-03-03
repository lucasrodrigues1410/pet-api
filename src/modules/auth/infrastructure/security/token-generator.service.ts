import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ITokenGenerator } from "../../domain/interfaces/token-generator.interface";
import { UserType } from "src/modules/user/domain/entities/user.entity";

interface User {
	id: number;
	name: string;
	email: string;
	type: UserType;
}

interface TokenPayload {
	sub: number;
	name: string;
	email: string;
	type: UserType;
}

@Injectable()
export class TokenGeneratorService implements ITokenGenerator {
	constructor(private jwtService: JwtService) {}

	generateToken(user: User): string {
		const payload: TokenPayload = {
			sub: user.id,
			name: user.name,
			email: user.email,
			type: user.type,
		};
		return this.jwtService.sign(payload);
	}

	async verifyToken(token: string): Promise<User | null> {
		try {
			const payload = await this.jwtService.verify(token) as TokenPayload;
			return {
				id: payload.sub,
				name: payload.name,
				email: payload.email,
				type: payload.type,
			};
		} catch {
			return null;
		}
	}
}
