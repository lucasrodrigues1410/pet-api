import {
	Body,
	Button,
	Column,
	Container,
	Head,
	Heading,
	Html,
	Preview,
	Row,
	Section,
	Tailwind,
	Text,
} from "@react-email/components";

const WelcomeTemplateComponent = () => {
	return (
		<Html lang="pt-BR">
			<Tailwind>
				<Head>
					<title>Bem-vindo ao PetSpot!</title>
				</Head>
				<Preview>
					Bem-vindo à plataforma que conecta você ao melhor para seu pet 🐾
				</Preview>
				<Body className="bg-[#f6f9fc] font-sans py-[40px]">
					<Container className="bg-white rounded-[8px] mx-auto p-[20px] max-w-[600px]">
						{/* Header */}
						<Section className="mt-[32px]">
							<Heading className="text-[28px] font-bold text-center text-[#512DA8] m-0">
								Bem-vindo ao PetSpot! 🐾
							</Heading>
							<Text className="text-[16px] text-center text-gray-600 mt-[16px] mb-[32px]">
								O lugar perfeito para conectar amantes de pets e os melhores
								serviços
							</Text>
						</Section>

						{/* Main Content */}
						<Section className="bg-[#F9F5FF] rounded-[8px] p-[24px] mb-[32px]">
							<Text className="text-[18px] font-medium text-[#512DA8] m-0 mb-[16px]">
								Olá, pet lover!
							</Text>
							<Text className="text-[16px] text-gray-700 m-0 mb-[16px]">
								Estamos muito felizes em ter você na comunidade PetSpot! Sua
								jornada para cuidar melhor do seu pet começa agora.
							</Text>

							<Heading className="text-[18px] font-bold text-[#512DA8] m-0 mb-[16px]">
								Descubra tudo o que o PetSpot oferece:
							</Heading>

							<Row className="mb-[16px]">
								<Column className="pr-[12px]">
									<Section className="bg-white rounded-[8px] p-[16px] border-l-[4px] border-[#7E57C2]">
										<Text className="text-[16px] font-medium text-[#512DA8] m-0 mb-[4px]">
											🔍 Encontre serviços próximos
										</Text>
										<Text className="text-[14px] text-gray-600 m-0">
											Localize os melhores pet shops, clínicas e serviços na sua
											região com avaliações reais
										</Text>
									</Section>
								</Column>
							</Row>

							<Row className="mb-[16px]">
								<Column className="pr-[12px]">
									<Section className="bg-white rounded-[8px] p-[16px] border-l-[4px] border-[#7E57C2]">
										<Text className="text-[16px] font-medium text-[#512DA8] m-0 mb-[4px]">
											📅 Agendamento simplificado
										</Text>
										<Text className="text-[14px] text-gray-600 m-0">
											Marque banho, tosa, consultas e outros serviços em poucos
											cliques, sem complicação
										</Text>
									</Section>
								</Column>
							</Row>

							<Row className="mb-[16px]">
								<Column className="pr-[12px]">
									<Section className="bg-white rounded-[8px] p-[16px] border-l-[4px] border-[#7E57C2]">
										<Text className="text-[16px] font-medium text-[#512DA8] m-0 mb-[4px]">
											💰 Ofertas exclusivas
										</Text>
										<Text className="text-[14px] text-gray-600 m-0">
											Receba descontos especiais e promoções personalizadas para
											as necessidades do seu pet
										</Text>
									</Section>
								</Column>
							</Row>

							<Row>
								<Column className="pr-[12px]">
									<Section className="bg-white rounded-[8px] p-[16px] border-l-[4px] border-[#7E57C2]">
										<Text className="text-[16px] font-medium text-[#512DA8] m-0 mb-[4px]">
											🌟 Comunidade pet
										</Text>
										<Text className="text-[14px] text-gray-600 m-0">
											Compartilhe experiências, avalie serviços e conecte-se com
											outros tutores de pets
										</Text>
									</Section>
								</Column>
							</Row>
						</Section>

						{/* CTA Button */}
						<Section className="text-center mb-[32px]">
							<Button
								className="bg-[#512DA8] text-white font-bold py-[12px] px-[24px] rounded-[8px] no-underline text-[16px] box-border"
								href="https://petspot.com.br/explorar"
							>
								Explorar PetSpot
							</Button>
						</Section>

						{/* Tips Section */}
						<Section className="border-t border-gray-200 pt-[24px] mb-[32px]">
							<Heading className="text-[20px] font-bold text-[#512DA8] m-0 mb-[16px]">
								Dicas para começar:
							</Heading>

							<Row>
								<Column>
									<Text className="text-[16px] text-gray-700 m-0 mb-[12px]">
										1. Complete seu perfil e adicione informações sobre seu pet
									</Text>
									<Text className="text-[16px] text-gray-700 m-0 mb-[12px]">
										2. Explore pet shops próximos e veja avaliações
									</Text>
									<Text className="text-[16px] text-gray-700 m-0 mb-[12px]">
										3. Agende seu primeiro serviço e ganhe pontos de fidelidade
									</Text>
								</Column>
							</Row>
						</Section>

						{/* Footer */}
						<Section className="border-t border-gray-200 pt-[24px]">
							<Text className="text-[14px] text-center text-gray-500 m-0 mb-[8px]">
								Siga-nos nas redes sociais para novidades e dicas para seu pet!
							</Text>
							<Text className="text-[14px] text-center text-gray-500 m-0 mb-[16px]">
								Instagram • Facebook • TikTok
							</Text>
							<Text className="text-[12px] text-center text-gray-400 m-0">
								© {new Date().getFullYear()} PetSpot. Todos os direitos
								reservados.
							</Text>
							<Text className="text-[12px] text-center text-gray-400 m-0">
								Av. Paulista, 1000 - São Paulo, SP
							</Text>
							<Text className="text-[12px] text-center text-gray-400 m-0 mt-[8px]">
								<a
									href="https://petspot.com.br/unsubscribe"
									className="text-gray-400"
								>
									Cancelar inscrição
								</a>{" "}
								•{" "}
								<a
									href="https://petspot.com.br/privacy"
									className="text-gray-400"
								>
									Política de Privacidade
								</a>
							</Text>
						</Section>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
};

export default WelcomeTemplateComponent;
