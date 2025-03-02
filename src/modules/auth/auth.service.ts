// import { Injectable } from "@nestjs/common";
// import { LoginDto } from "./dto/login.dto";
// import { PrismaService } from "src/prisma/prisma.service";
// import { compareSync, hashSync } from "bcrypt";
// import { InvalidCredentialsError } from "../../common/exceptions/invalid-credentials-error";
// import { JwtService } from "@nestjs/jwt";
// import { RegisterDto } from "./dto/register.dto";
// import { UserRoles } from "./roles/roles";

// @Injectable()
// export class AuthService {
// 	constructor(
// 		private prismaService: PrismaService,
// 		private jwtService: JwtService,
// 	) {}

// 	async login(body: LoginDto) {
// 		const user = await this.prismaService.user.findUnique({
// 			where: {
// 				email: body.email,
// 			},
// 		});
// 		if (!user || !compareSync(body.password, user.password)) {
// 			throw new InvalidCredentialsError();
// 		}

// 		const payload = {
// 			sub: user.id,
// 			email: user.email,
// 		};

// 		return {
// 			access_token: this.jwtService.sign(payload),
// 		};
// 	}

// 	async register(body: RegisterDto) {
// 		return this.prismaService.user.create({
// 			data: {
// 				email: body.email,
// 				name: body.name,
// 				password: hashSync(body.password, 10),
// 				type: UserRoles.CUSTOMER
// 			},
// 		});
// 	}
// }
