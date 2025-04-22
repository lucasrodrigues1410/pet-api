import {
	Body,
	Button,
	Container,
	Head,
	Heading,
	Hr,
	Html,
	Img,
	Link,
	Preview,
	Section,
	Tailwind,
	Text,
} from "@react-email/components";

interface UserCreatedTemplateProps {
	userName: string;
}

export const UserCreatedTemplate = ({ userName }: UserCreatedTemplateProps) => {
	const baseUrl = "https://seusistemapet.com";

	return (
		<Html>
			<Head />
			<Preview>Bem-vindo ao Sistema PET - Confirme seu cadastro</Preview>
			<Tailwind>
				<Body className="bg-white font-sans">
					<Container className="mx-auto py-5 px-5 max-w-[600px]">
						<Section className="mt-8">
							<Img
								src={`${baseUrl}/static/logo.png`}
								width="120"
								height="50"
								alt="Logo Sistema PET"
								className="mx-auto"
							/>
						</Section>
						<Section className="mt-8 bg-blue-50 rounded-lg p-6">
							<Heading className="text-2xl font-bold text-center text-blue-600 mb-4">
								Bem-vindo ao Sistema PET!
							</Heading>
							<Text className="text-gray-700 text-base mb-4">
								Olá, <strong>{userName}</strong>!
							</Text>
							<Text className="text-gray-700 text-base mb-4">
								Obrigado por se cadastrar em nosso sistema. Estamos muito
								felizes em ter você conosco! Para começar a usar todos os
								recursos do nosso sistema para cuidar do seu pet, por favor
								confirme seu email.
							</Text>
						</Section>
						<Section className="mt-8 bg-gray-50 rounded-lg p-6">
							<Heading className="text-xl font-bold text-gray-800 mb-4">
								O que você pode fazer no Sistema PET:
							</Heading>
							<ul className="list-disc pl-6 mb-4">
								<li className="text-gray-700 mb-2">
									Gerenciar informações dos seus pets
								</li>
								<li className="text-gray-700 mb-2">
									Agendar consultas veterinárias
								</li>
								<li className="text-gray-700 mb-2">
									Receber lembretes de vacinação
								</li>
								<li className="text-gray-700 mb-2">
									Acompanhar histórico médico
								</li>
								<li className="text-gray-700 mb-2">
									Comprar produtos para seu pet
								</li>
							</ul>
						</Section>
						<Section className="mt-8">
							<Text className="text-gray-700 text-sm">
								Se você não solicitou este cadastro, por favor ignore este email
								ou entre em contato com nosso suporte.
							</Text>
						</Section>
						<Hr className="border-gray-300 my-6" />
						<Section>
							<Text className="text-xs text-gray-500 text-center">
								© 2025 Sistema PET. Todos os direitos reservados.
							</Text>
							<Text className="text-xs text-gray-500 text-center mt-2">
								Rua dos Animais, 123 - Bairro Pet - Cidade, Estado
							</Text>
							<Text className="text-xs text-gray-500 text-center mt-4">
								<Link
									href={`${baseUrl}/privacidade`}
									className="text-blue-500 underline"
								>
									Política de Privacidade
								</Link>{" "}
								•{" "}
								<Link
									href={`${baseUrl}/termos`}
									className="text-blue-500 underline"
								>
									Termos de Uso
								</Link>
							</Text>
						</Section>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
};

export default UserCreatedTemplate;
