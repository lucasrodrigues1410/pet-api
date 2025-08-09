import { z } from "zod";
import { animalDto } from "@/modules/animal/infra/http/dtos/animal.dto";
import { companyDto } from "@/modules/company/infra/http/dtos/company.dto";
import { serviceDto } from "@/modules/service/infra/http/dtos/service.dto";
import { userDto } from "@/modules/user/infra/http/dtos/user.dto";
import { AppointmentDto } from "./appointment.dto";

export const AppointmentDetailsDto = z.object({
	...AppointmentDto.shape,
	animal: animalDto,
	company: companyDto,
	client: userDto,
	service: serviceDto,
});
