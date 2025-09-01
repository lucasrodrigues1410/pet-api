import { PrismaClient } from "prisma/generated/client";

const locations = [
	{
		id: '1',
		addressLine: "Rua das Flores",
		number: "123",
		complement: "Loja A",
		neighborhood: "Centro",
		city: "São Paulo",
		state: "SP",
		country: "Brasil",
		postalCode: "01310-100",
		latitude: -23.5505,
		longitude: -46.6333,
	},
	{
		id: '2',
		addressLine: "Av. Brasil",
		number: "456",
		complement: null,
		neighborhood: "Vila Nova",
		city: "São Paulo", 
		state: "SP",
		country: "Brasil",
		postalCode: "02511-000",
		latitude: -23.5489,
		longitude: -46.6388,
	},
	{
		id: '3',
		addressLine: "Rua Alegre",
		number: "789",
		complement: "Andar Térreo",
		neighborhood: "Jardim América",
		city: "São Paulo",
		state: "SP", 
		country: "Brasil",
		postalCode: "01448-000",
		latitude: -23.5693,
		longitude: -46.6658,
	},
	{
		id: '4',
		addressLine: "Rua do Carinho",
		number: "321",
		complement: "Casa",
		neighborhood: "Bela Vista",
		city: "São Paulo",
		state: "SP",
		country: "Brasil", 
		postalCode: "01321-020",
		latitude: -23.5629,
		longitude: -46.6544,
	},
	// Localizações adicionais para algumas empresas
	{
		id: '5',
		addressLine: "Rua Augusta",
		number: "1000",
		complement: "Loja 15",
		neighborhood: "Consolação",
		city: "São Paulo",
		state: "SP",
		country: "Brasil",
		postalCode: "01305-100",
		latitude: -23.5558,
		longitude: -46.6396,
	},
	{
		id: '6',
		addressLine: "Av. Paulista",
		number: "2000",
		complement: "Subsolo",
		neighborhood: "Cerqueira César",
		city: "São Paulo",
		state: "SP",
		country: "Brasil",
		postalCode: "01310-300",
		latitude: -23.5613,
		longitude: -46.6565,
	},
];

export async function createLocation(prisma: PrismaClient) {
	for (const location of locations) {
		// Criar localização
		await prisma.location.upsert({
			where: { id: location.id },
			update: {},
			create: location,
		});
	}
}
