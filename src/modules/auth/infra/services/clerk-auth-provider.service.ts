import { clerkClient, UserJSON } from "@clerk/fastify";
import { verifyWebhook } from "@clerk/fastify/webhooks";
import { Injectable, Logger } from "@nestjs/common";
import type { FastifyRequest } from "fastify";
import { EnvService } from "@/core/infra/env/env.service";
import { CreateOrUpdateUserFromExternalUseCase } from "../../application/use-cases/create-or-update-user-from-external.use-case";
import { AuthProviderService } from "../../domain/interfaces/auth-provider.service.interface";

@Injectable()
export class ClerkAuthProviderService extends AuthProviderService {
	private readonly logger = new Logger(ClerkAuthProviderService.name);

	constructor(
		private readonly createOrUpdateUserService: CreateOrUpdateUserFromExternalUseCase,
		private readonly envService: EnvService,
	) {
		super();
	}

	async processWebhook(req: FastifyRequest): Promise<void> {
		try {
			const event = await verifyWebhook(req, {
				signingSecret: this.envService.get("CLERK_WEBHOOK_SIGNING_SECRET"),
			});
			this.logger.log(`Clerk webhook event: ${event.type}`);

			switch (event.type) {
				case "user.created": {
					const response = await this.updateUser(event.data);
					if (response.isLeft()) {
						this.logger.error(
							`Erro ao criar usuário: ${response.value.message}`,
						);
						break;
					}
					this.updatePublicMetadata(event.data.id, {
						appUserId: response.value.id,
					});
					this.logger.log(`Novo usuário criado: ${event.data.id}`);
					break;
				}

				case "user.updated":
					await this.updateUser(event.data);
					this.logger.log(`Usuário atualizado: ${event.data.id}`);
					break;

				case "user.deleted":
					//TODO: implementar lógica de exclusão se necessário
					break;

				default:
					this.logger.debug(`Evento não tratado: ${event.type}`);
			}
		} catch (error) {
			this.logger.error("Erro ao processar webhook Clerk", error);
			throw error;
		}
	}

	async updatePublicMetadata(
		userId: string,
		metadata: Record<string, any>,
	): Promise<void> {
		try {
			await clerkClient.users.updateUserMetadata(userId, {
				publicMetadata: metadata,
			});
			this.logger.log(`Metadados públicos atualizados para usuário ${userId}`);
		} catch (error) {
			this.logger.error(
				`Erro ao atualizar public metadata para usuário ${userId}`,
				error,
			);
			throw error;
		}
	}

	async updatePrivateMetadata(
		userId: string,
		metadata: Record<string, any>,
	): Promise<void> {
		try {
			await clerkClient.users.updateUserMetadata(userId, {
				privateMetadata: metadata,
			});
			this.logger.log(`Metadados privados atualizados para usuário ${userId}`);
		} catch (error) {
			this.logger.error(
				`Erro ao atualizar private metadata para usuário ${userId}`,
				error,
			);
			throw error;
		}
	}

	private async updateUser(user: UserJSON) {
		return this.createOrUpdateUserService.execute({
			email: user.email_addresses[0].email_address,
			authProviderId: user.id,
			avatarUrl: user.image_url,
			name: `${user.first_name} ${user.last_name}`.trim(),
		});
	}
}
