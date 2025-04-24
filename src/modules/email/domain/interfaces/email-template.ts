export interface EmailTemplate<
	TVariables extends Record<string, unknown> = {},
> {
	readonly subject: string;
	render(variables: TVariables): string | Promise<string>;
}
