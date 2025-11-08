export abstract class AuthProviderService {
	public abstract processWebhook(req: unknown): Promise<void>;
	public abstract updatePublicMetadata(
		userId: string,
		metadata: Record<string, any>,
	): Promise<void>;
}
