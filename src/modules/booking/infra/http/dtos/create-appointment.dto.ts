import { set } from "date-fns";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";
import { coatType } from "@/modules/appointment/domain/entities/appointment.entity";

const request = z.object({
	date: z.iso.datetime().transform((val) =>
		set(new Date(val), {
			seconds: 0,
			milliseconds: 0,
		}),
	),
	serviceId: z.string(),
	animalId: z.string(),
	coatType: z.enum(coatType),
});

export class CreateAppointmentRequestDto extends createZodDto(request) {}
