export interface ITokenGenerator {
	generateToken(payload: {
		id: number;
		name: string;
		email: string;
	}): string;

    verifyToken(token: string): Promise<{
        id: number;
        name: string;
        email: string;
    } | null>;
}
