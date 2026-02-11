import { PrismaClient } from "prisma/generated/client";
import { createAnimal } from "./animal";
import { createAnimalType } from "./animal-type";
import { createAppointment } from "./appointment";
import { createAsset } from "./asset";
import { createBreed } from "./breed";
import { createCompany } from "./company";
import { createDisease } from "./disease";
import { createLocation } from "./location";
import { createNotification } from "./notification";
import { createRating } from "./rating";
import { createService } from "./service";
import { createUser } from "./user";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = `${process.env.DATABASE_URL}`
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
	console.log("🌱 Iniciando seeding do banco de dados...");
	
	try {
		// 1. Criar usuários primeiro (dependência de outros modelos)
		console.log("👥 Criando usuários...");
		await createUser(prisma);
		
		// 2. Criar tipos de animais e raças
		console.log("🐕 Criando tipos de animais e raças...");
		await createAnimalType(prisma);
		await createBreed(prisma);
		
		// 2.5. Criar doenças
		console.log("🦠 Criando doenças...");
		await createDisease(prisma);
		
		// 3. Criar assets (imagens para os animais)
		console.log("🖼️ Criando assets (imagens)...");
		await createAsset(prisma);
		
		// 4. Criar animais (depende de usuários, raças e assets)
		console.log("🐾 Criando animais...");
		await createAnimal(prisma);

		// 5. Criar localizações (depende de empresas)
		console.log("📍 Criando localizações...");
		await createLocation(prisma);
		
		// 6. Criar empresas (depende de usuários)
		console.log("🏢 Criando empresas e horários...");
		await createCompany(prisma);
		
		// 7. Criar serviços e categorias (depende de empresas)
		console.log("⚙️ Criando serviços e promoções...");
		await createService(prisma);
		
		// 8. Criar agendamentos (depende de animais, serviços, usuários e empresas)
		console.log("📅 Criando agendamentos...");
		await createAppointment(prisma);
		
		// 9. Criar avaliações (depende de usuários e empresas)
		console.log("⭐ Criando avaliações...");
		await createRating(prisma);
		
		// 10. Criar notificações (depende de usuários)
		console.log("🔔 Criando notificações...");
		await createNotification(prisma);
		
		console.log("✅ Seeding concluído com sucesso!");
		console.log("\n📊 Dados criados:");
		console.log("• 12 usuários (8 clientes + 4 empresários)");
		console.log("• 4 empresas com horários de funcionamento");
		console.log("• 5 tipos de animais e 37 raças");
		console.log("• 15 doenças comuns (raiva, parvovirose, etc...)");
		console.log("• 30 assets (imagens para os animais)");
		console.log("• 20 animais variados com imagens");
		console.log("• 6 localizações");
		console.log("• 13 serviços em 5 categorias");
		console.log("• 2 promoções ativas");
		console.log("• ~100 agendamentos (passados, presentes e futuros)");
		console.log("• 15 avaliações de clientes");
		console.log("• 16 notificações diversas");
		
	} catch (error) {
		console.error("❌ Erro durante o seeding:", error);
		throw error;
	}
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
