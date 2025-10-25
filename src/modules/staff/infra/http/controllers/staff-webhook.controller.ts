import { verifyWebhook } from "@clerk/fastify/webhooks";
import { BadRequestException, Controller, Post, Req } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import type { FastifyRequest } from "fastify";
import { CreateStaffUseCase } from "@/modules/staff/application/use-cases/create-staff.use-case";
import { StaffRole } from "@/modules/staff/domain/entities/staff.entity";

@ApiTags("Colaboradores")
@Controller("staffs/webhook")
export class StaffWebhookController {
	constructor(private readonly createStaffUseCase: CreateStaffUseCase) {}

	@Post()
	async handleWebhook(@Req() req: FastifyRequest) {
		try {
			const event = await verifyWebhook(req);
			if (event.type === "organizationMembership.created") {
				const companyId = event.data.public_metadata.appCompanyId as string;
				await this.createStaffUseCase.execute({
					email: event.data.public_user_data.identifier,
					name: `${event.data.public_user_data.first_name} ${event.data.public_user_data.last_name}`,
					companyId,
					role: event.data.role as StaffRole,
				});
			}
		} catch (_) {
			throw new BadRequestException("Invalid webhook payload");
		}
		return { received: true };
	}
}
