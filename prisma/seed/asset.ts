import { PrismaClient } from "prisma/generated/client";

const assets = [
	// Imagens para cães
	{
		id: "asset-labrador",
		name: "Labrador Retriever",
		url: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b", // Imagem real de Labrador
		fileType: "image/jpeg",
		width: 800,
		height: 600,
		thumbnailUrl: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=200",
		userId: "user-1",
	},
	{
		id: "asset-golden",
		name: "Golden Retriever",
		url: "https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg", // Imagem real de Golden Retriever
		fileType: "image/jpeg",
		width: 800,
		height: 600,
		thumbnailUrl: "https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?w=200",
		userId: "user-4",
	},
	{
		id: "asset-pastor-alemao",
		name: "Pastor Alemão",
		url: "https://images.unsplash.com/photo-1549478369-da386841a018", // Imagem real de Pastor Alemão
		fileType: "image/jpeg",
		width: 800,
		height: 600,
		thumbnailUrl: "https://images.unsplash.com/photo-1549478369-da386841a018?w=200",
		userId: "user-2",
	},
	{
		id: "asset-bulldog-frances",
		name: "Bulldog Francês",
		url: "https://images.pexels.com/photos/2462044/pexels-photo-2462044.jpeg", // Imagem real de Bulldog Francês
		fileType: "image/jpeg",
		width: 800,
		height: 600,
		thumbnailUrl: "https://images.pexels.com/photos/2462044/pexels-photo-2462044.jpeg?w=200",
		userId: "user-3",
	},
	{
		id: "asset-poodle",
		name: "Poodle",
		url: "https://images.unsplash.com/photo-1583337130417-3346a1be7b66", // Imagem real de Poodle
		fileType: "image/jpeg",
		width: 800,
		height: 600,
		thumbnailUrl: "https://images.unsplash.com/photo-1583337130417-3346a1be7b66?w=200",
		userId: "user-4",
	},
	{
		id: "asset-yorkshire",
		name: "Yorkshire Terrier",
		url: "https://images.pexels.com/photos/1851928/pexels-photo-1851928.jpeg", // Imagem real de Yorkshire
		fileType: "image/jpeg",
		width: 800,
		height: 600,
		thumbnailUrl: "https://images.pexels.com/photos/1851928/pexels-photo-1851928.jpeg?w=200",
		userId: "user-5",
	},
	{
		id: "asset-beagle",
		name: "Beagle",
		url: "https://images.unsplash.com/photo-1583337130417-3346a1be7b66", // Imagem real de Beagle
		fileType: "image/jpeg",
		width: 800,
		height: 600,
		thumbnailUrl: "https://images.unsplash.com/photo-1583337130417-3346a1be7b66?w=200",
		userId: "user-6",
	},
	{
		id: "asset-shih-tzu",
		name: "Shih Tzu",
		url: "https://images.pexels.com/photos/1170974/pexels-photo-1170974.jpeg", // Imagem real de Shih Tzu
		fileType: "image/jpeg",
		width: 800,
		height: 600,
		thumbnailUrl: "https://images.pexels.com/photos/1170974/pexels-photo-1170974.jpeg?w=200",
		userId: "user-6",
	},
	{
		id: "asset-border-collie",
		name: "Border Collie",
		url: "https://images.unsplash.com/photo-1537151608828-ea73dedd50ba", // Imagem real de Border Collie
		fileType: "image/jpeg",
		width: 800,
		height: 600,
		thumbnailUrl: "https://images.unsplash.com/photo-1537151608828-ea73dedd50ba?w=200",
		userId: "user-7",
	},
	{
		id: "asset-husky",
		name: "Husky Siberiano",
		url: "https://images.pexels.com/photos/1581368/pexels-photo-1581368.jpeg", // Imagem real de Husky
		fileType: "image/jpeg",
		width: 800,
		height: 600,
		thumbnailUrl: "https://images.pexels.com/photos/1581368/pexels-photo-1581368.jpeg?w=200",
		userId: "user-8",
	},
	{
		id: "asset-chihuahua",
		name: "Chihuahua",
		url: "https://images.unsplash.com/photo-1592194996308-184af5444566", // Imagem real de Chihuahua
		fileType: "image/jpeg",
		width: 800,
		height: 600,
		thumbnailUrl: "https://images.unsplash.com/photo-1592194996308-184af5444566?w=200",
		userId: "user-8",
	},
	{
		id: "asset-dachshund",
		name: "Dachshund",
		url: "https://images.pexels.com/photos/4827300/pexels-photo-4827300.jpeg", // Imagem real de Dachshund
		fileType: "image/jpeg",
		width: 800,
		height: 600,
		thumbnailUrl: "https://images.pexels.com/photos/4827300/pexels-photo-4827300.jpeg?w=200",
		userId: "user-3",
	},
	{
		id: "asset-vira-lata-cao",
		name: "Vira-lata (Cão)",
		url: "https://images.unsplash.com/photo-1583337130417-3346a1be7b66", // Imagem real de vira-lata
		fileType: "image/jpeg",
		width: 800,
		height: 600,
		thumbnailUrl: "https://images.unsplash.com/photo-1583337130417-3346a1be7b66?w=200",
		userId: "user-1",
	},

	// Imagens para gatos
	{
		id: "asset-persa",
		name: "Gato Persa",
		url: "https://images.pexels.com/photos/1170981/pexels-photo-1170981.jpeg", // Imagem real de Gato Persa
		fileType: "image/jpeg",
		width: 800,
		height: 600,
		thumbnailUrl: "https://images.pexels.com/photos/1170981/pexels-photo-1170981.jpeg?w=200",
		userId: "user-1",
	},
	{
		id: "asset-siames",
		name: "Gato Siamês",
		url: "https://images.unsplash.com/photo-1560128102-2665dfe31519", // Imagem real de Gato Siamês
		fileType: "image/jpeg",
		width: 800,
		height: 600,
		thumbnailUrl: "https://images.unsplash.com/photo-1560128102-2665dfe31519?w=200",
		userId: "user-3",
	},
	{
		id: "asset-maine-coon",
		name: "Maine Coon",
		url: "https://images.pexels.com/photos/1457825/pexels-photo-1457825.jpeg", // Imagem real de Maine Coon
		fileType: "image/jpeg",
		width: 800,
		height: 600,
		thumbnailUrl: "https://images.pexels.com/photos/1457825/pexels-photo-1457825.jpeg?w=200",
		userId: "user-7",
	},
	{
		id: "asset-vira-lata-gato",
		name: "Vira-lata (Gato)",
		url: "https://images.unsplash.com/photo-1573865526796-585baf7b46da", // Imagem real de gato vira-lata
		fileType: "image/jpeg",
		width: 800,
		height: 600,
		thumbnailUrl: "https://images.unsplash.com/photo-1573865526796-585baf7b46da?w=200",
		userId: "user-2",
	},

	// Imagens para outros animais
	{
		id: "asset-hamster",
		name: "Hamster Sírio",
		url: "https://images.pexels.com/photos/1156684/pexels-photo-1156684.jpeg", // Imagem real de Hamster
		fileType: "image/jpeg",
		width: 800,
		height: 600,
		thumbnailUrl: "https://images.pexels.com/photos/1156684/pexels-photo-1156684.jpeg?w=200",
		userId: "user-5",
	},
	{
		id: "asset-canario",
		name: "Canário",
		url: "https://images.unsplash.co3m/photo-161749019730-24c4277e740f", // Imagem real de Canário
		fileType: "image/jpeg",
		width: 800,
		height: 600,
		thumbnailUrl: "https://images.unsplash.com/photo-1613749019730-24c4277e740f?w=200",
		userId: "user-7",
	},
	{
		id: "asset-coelho",
		name: "Coelho Angorá",
		url: "https://images.pexels.com/photos/1307921/pexels-photo-1307921.jpeg", // Imagem real de Coelho Angorá
		fileType: "image/jpeg",
		width: 800,
		height: 600,
		thumbnailUrl: "https://images.pexels.com/photos/1307921/pexels-photo-1307921.jpeg?w=200",
		userId: "user-8",
	},
];

export async function createAsset(prisma: PrismaClient) {
	for (const asset of assets) {
		await prisma.asset.upsert({
			where: { id: asset.id },
			update: {},
			create: asset,
		});
	}
}
