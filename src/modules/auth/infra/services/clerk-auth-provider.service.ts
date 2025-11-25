import { clerkClient, UserJSON } from "@clerk/fastify";
import { verifyWebhook } from "@clerk/fastify/webhooks";
import { Injectable, Logger } from "@nestjs/common";
import type { FastifyRequest } from "fastify";
import { SyncExternalUserUseCase } from "../../application/use-cases/sync-external-user.use-case";
import { AuthProviderService } from "../../domain/interfaces/auth-provider.service.interface";

@Injectable()
export class ClerkAuthProviderService extends AuthProviderService {
	private readonly logger = new Logger(ClerkAuthProviderService.name);

	constructor(private readonly syncExtUserUseCase: SyncExternalUserUseCase) {
		super();
	}

	async processWebhook(req: FastifyRequest): Promise<void> {
		try {
			const event = await verifyWebhook(req);
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

				case "session.created": {
					const appUserId = event.data.public_metadata?.appUserId;
					if (!appUserId) {
						await this.updateUser(event.data.user);
						this.logger.log(
							`Sessão criada para usuário: ${event.data.user.id}`,
						);
					}
					break;
				}
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

	private async updateUser(user: UserJSON) {
		return this.syncExtUserUseCase.execute({
			email: user.email_addresses[0].email_address,
			authProviderId: user.id,
			avatarUrl: user.image_url,
			name: `${user.first_name} ${user.last_name || ''}`.trim()
		});
	}
}
