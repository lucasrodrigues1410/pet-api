import { createZodDto } from "nestjs-zod";
import { userDto } from "./user.dto";

export class UserResponse extends createZodDto(userDto) {}
