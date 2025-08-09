import { set } from "date-fns";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";
import { CoatType } from "@/modules/appointment/domain/enums/appointment.enum";

const request = z.object({
	date: z.iso.datetime().transform((val) =>
		set(new Date(val), {
			seconds: 0,
			milliseconds: 0,
		}),
	),
	serviceId: z.string(),
	animalId: z.string(),
	coatType: z.enum(CoatType),
});

export class CreateAppointmentRequestDto extends createZodDto(request) { }
