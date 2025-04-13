import { set } from "date-fns";
import { createZodDto } from "@anatine/zod-nestjs";
import { z } from "zod";
import { CoatType } from "@/modules/appointment/domain/entities/appointment.entity";

const createAppointmentRequest = z.object({
	date: z
		.string()
		.datetime()
		.transform((val) =>
			set(new Date(val), {
				seconds: 0,
				milliseconds: 0,
			}),
		),
	serviceId: z.string(),
	animalId: z.string(),
	coatType: z.nativeEnum(CoatType)
});

export class CreateAppointmentRequestDto extends createZodDto(
	createAppointmentRequest,
) {}
