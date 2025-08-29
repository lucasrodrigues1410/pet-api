import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { z } from "zod";
import { EnvService } from "@/core/infra/env/env.service";
import { userType } from "@/modules/user/domain/entities/user.entity";

const tokenPayloadSchema = z.object({
	sub: z.string(),
	name: z.string(),
	email: z.email(),
	type: z.enum(userType),
	companyId: z.string().optional(),
	role: z.string().optional(),
	avatar: z.string().optional(),
});

export type UserPayload = z.infer<typeof tokenPayloadSchema>;

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(config: EnvService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: `${config.get("JWT_SECRET")}`,
		});
	}

	async validate(payload: UserPayload) {
		return tokenPayloadSchema.parse(payload);
	}
}
