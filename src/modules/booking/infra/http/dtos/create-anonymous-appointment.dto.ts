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
	companyId: z.string(),
	coatType: z.enum(CoatType),
	client: z.object({
		name: z.string().min(1, "Nome do cliente é obrigatório"),
		phone: z.string().min(10, "Telefone deve ter pelo menos 10 dígitos"),
		email: z.email("Email inválido"),
	}),
	animal: z.object({
		name: z.string().min(1, "Nome do animal é obrigatório"),
		weight: z.number().positive("Peso deve ser positivo"),
		breedId: z.string(),
	}),
});

export class CreateAnonymousAppointmentRequestDto extends createZodDto(
	request,
) {}
