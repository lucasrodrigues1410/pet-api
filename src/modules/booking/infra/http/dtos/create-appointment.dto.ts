import { set } from "date-fns";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";
import { coatType } from "@/modules/appointment/domain/entities/appointment.entity";
import { stringToDate } from "@/shared/schemas/string-to-date";

const request = z.object({
	date: stringToDate.transform((val) =>
		set(new Date(val), { seconds: 0, milliseconds: 0 }),
	),
	serviceId: z.string(),
	animalId: z.string(),
	coatType: z.enum(coatType),
});

const response = z.object({
	appointmentId: z.string(),
	checkoutUrl: z.url().optional(),
});

export class CreateAppointmentResponseDto extends createZodDto(response) {}
export class CreateAppointmentRequestDto extends createZodDto(request) {}
