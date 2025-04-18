import { z } from "zod";
import { AppointmentDto } from "./appointment.dto";
import { animalDto } from "@/modules/animal/infra/http/dtos/animal.dto";
import { companyDto } from "@/modules/company/infra/http/dtos/company.dto";
import { userDto } from "@/modules/user/infra/http/dtos/user.dto";
import { serviceDto } from "@/modules/service/infra/http/dtos/service.dto";

export const AppointmentDetailsDto = AppointmentDto.and(
	z.object({
		animal: animalDto,
		company: companyDto,
		client: userDto,
		service: serviceDto,
	}),
);
