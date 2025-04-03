import { createZodDto } from "nestjs-zod";
import { z } from "zod";

const createAppointmentRequest = z.object({
    date: z.coerce.date(),
    serviceId: z.string(),
    animalId: z.string(),
});


export class CreateAppointmentRequestDto extends createZodDto(createAppointmentRequest){}