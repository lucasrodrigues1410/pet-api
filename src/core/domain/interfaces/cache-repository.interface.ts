export abstract class CacheRepository {
	abstract set(
		key: string,
		value: string,
		options:
			| {
					ttl?: number;
					[key: string]: any;
			  }
			| undefined,
	): Promise<void>;
	abstract get(key: string): Promise<string | null>;
	abstract delete(key: string): Promise<void>;
}
