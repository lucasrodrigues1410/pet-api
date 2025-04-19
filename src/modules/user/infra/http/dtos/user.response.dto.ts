import { createZodDto } from "@anatine/zod-nestjs";
import { userDto } from "./user.dto";

export class UserResponse extends createZodDto(userDto) {}
