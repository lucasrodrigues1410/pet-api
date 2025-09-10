import {
	Body,
	Controller,
	ForbiddenException,
	Get,
	NotFoundException,
	Param,
	Patch,
	Query,
	UseGuards,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { ZodResponse } from "nestjs-zod";
import { GetAppointmentByCompanyIdUseCase } from "@/modules/appointment/application/use-cases/get-appointment-by-company-id.use-case";
import { GetAppointmentByIdUseCase } from "@/modules/appointment/application/use-cases/get-appointment-by-id.use-case";
import { GetAppointmentByUserIdUseCase } from "@/modules/appointment/application/use-cases/get-appointment-by-user-id.use-case";
import { UpdateAppointmentStatusUseCase } from "@/modules/appointment/application/use-cases/update-appointment-status.use-case";
import { User } from "@/modules/auth/infra/http/decorators/user.decorator";
import { UserTypeDecorator } from "@/modules/auth/infra/http/decorators/user-type.decorator";
import { CompanyGuard } from "@/modules/company/infra/http/guards/company.guard";
import type { UserType } from "@/modules/user/domain/entities/user.entity";
import {
	AppointmentsByClientQueryDto,
	AppointmentsByClientResponseDto,
} from "../dtos/appointment-by-client.dto";
import {
	AppointmentsByCompanyQueryDto,
	AppointmentsByCompanyResponseDto,
} from "../dtos/appointment-by-company.dto";
import { AppointmentByIdResponseDto } from "../dtos/appointment-by-id.dto";
import {
	UpdateAppointmentStatusDto,
	UpdateAppointmentStatusResponseDto,
} from "../dtos/update-appointment-status.dto";

@ApiTags("Agendamentos")
@Controller("appointments")
export class AppointmentController {
	constructor(
		private readonly getAppointmentByIdUseCase: GetAppointmentByIdUseCase,
		private readonly getAppointmentByUserIdUseCase: GetAppointmentByUserIdUseCase,
		private readonly getAppointmentByCompanyIdUseCase: GetAppointmentByCompanyIdUseCase,
		private readonly updateAppointmentStatusUseCase: UpdateAppointmentStatusUseCase,
	) {}

	@Get("/company/:companyId")
	@ApiOperation({
		summary: "Retorna todos os agendamentos da empresa",
		operationId: "getAllCompanyAppointments",
	})
	@ZodResponse({ status: 200, type: AppointmentsByCompanyResponseDto })
	@UserTypeDecorator("company")
	@UseGuards(CompanyGuard)
	async getAllCompanyAppointments(
		@Param("companyId") companyId: string,
		@Query() query: AppointmentsByCompanyQueryDto,
	) {
		const response = await this.getAppointmentByCompanyIdUseCase.execute({
			companyId,
			query,
		});

		if (response.isLeft()) {
			throw new NotFoundException(response.value.message);
		}

		return {
			meta: response.value.meta,
			items: response.value.items.map((item) => {
				return {
					...item.toObject(),
					animal: {
						...item.animal.toObject(),
						breed: item.animal.breed?.toObject(),
					},
					client: item.client.toObject(),
					service: item.service.toObject(),
				};
			}),
		};
	}

	@Get("/user")
	@ApiOperation({
		summary: "Retorna todos os agendamentos do cliente",
		operationId: "getAllAppointments",
	})
	@ZodResponse({ status: 200, type: AppointmentsByClientResponseDto })
	@UserTypeDecorator("customer")
	async getAllAppointments(
		@User("sub") userId: string,
		@Query() query: AppointmentsByClientQueryDto,
	) {
		const response = await this.getAppointmentByUserIdUseCase.execute({
			userId,
			query,
		});

		if (response.isLeft()) {
			throw new NotFoundException();
		}

		return {
			meta: response.value.meta,
			items: response.value.items.map((item) => {
				return {
					...item.toObject(),
					animal: item.animal.toObject(),
					service: item.service.toObject(),
					company: item.company.toObject(),
				};
			}),
		};
	}

	@Patch(":id/status")
	@ApiOperation({
		summary: "Atualiza o status de um agendamento",
		operationId: "updateAppointmentStatus",
	})
	@ZodResponse({ status: 200, type: UpdateAppointmentStatusResponseDto })
	@UserTypeDecorator("customer", "company")
	async updateAppointmentStatus(
		@Param("id") appointmentId: string,
		@Body() updateStatusDto: UpdateAppointmentStatusDto,
		@User("sub") userId: string,
		@User("type") userType: UserType,
		@User("companyId") companyId?: string,
	) {
		const response = await this.updateAppointmentStatusUseCase.execute({
			appointmentId,
			newStatus: updateStatusDto.status,
			userId,
			userType,
			companyId,
		});

		if (response.isLeft()) {
			const error = response.value;
			if (error.constructor.name === "ResourceNotFoundError") {
				throw new NotFoundException(error.message);
			}
			throw new ForbiddenException(error.message);
		}

		const appointment = response.value;
		return {
			id: appointment.id.toString(),
			status: appointment.status,
			updatedAt: new Date().toISOString(),
		};
	}

	@Get(":id")
	@ApiOperation({
		summary: "Retorna um agendamento pelo ID",
		operationId: "getAppointmentById",
	})
	@ZodResponse({ status: 200, type: AppointmentByIdResponseDto })
	@UserTypeDecorator("customer", "company")
	async getAppointmentById(
		@Param("id") id: string,
		@User("sub") userId: string,
		@User("type") userType: UserType,
		@User("companyId") companyId?: string,
	) {
		const response = await this.getAppointmentByIdUseCase.execute({
			id,
			userId,
			userType,
			companyId,
		});

		if (response.isLeft()) {
			throw new NotFoundException(response.value.message);
		}
		return {
			...response.value.toObject(),
			animal: {
				...response.value.animal.toObject(),
				breed: response.value.animal.breed.toObject(),
				asset: response.value.animal.asset?.toObject(),
			},
			client: response.value.client.toObject(),
			service: response.value.service.toObject(),
			company: response.value.company.toObject(),
		};
	}
}
