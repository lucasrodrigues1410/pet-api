export class InvalidTemplateVariablesError extends Error {
	constructor(unexpectedVariables: string[]) {
		super(
			`Recebida variáveis inesperadas: ${unexpectedVariables.join(
				", ",
			)}`,
		);
	}
}
