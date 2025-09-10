export function normalizeText(text: string): string {
	return text
		.normalize("NFD") // Remove acentos
		.replace(/[\u0300-\u036f]/g, "") // Remove diacríticos
		.toLowerCase()
		.replace(/[^a-z0-9]/g, " ") // Substitui tudo que não é letra/número por espaço
		.replace(/\s+/g, " ") // Remove espaços extras
		.trim();
}
