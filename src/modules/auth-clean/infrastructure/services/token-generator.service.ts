import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ITokenGenerator } from "../../domain/interfaces/token-generator.interface";

interface User {
	id: number;
	name: string;
	email: string;
}

interface TokenPayload {
	sub: number;
	name: string;
	email: string;
}

@Injectable()
export class TokenGeneratorService implements ITokenGenerator {
	constructor(private jwtService: JwtService) {}

	generateToken(user: User): string {
		const payload: TokenPayload = {
			sub: user.id,
			name: user.name,
			email: user.email,
		};
		return this.jwtService.sign(payload);
	}

	verifyToken(token: string): User | null {
		try {
			const payload = this.jwtService.verify(token) as TokenPayload;
			return { id: payload.sub, name: payload.name, email: payload.email };
		} catch {
			return null;
		}
	}
}
