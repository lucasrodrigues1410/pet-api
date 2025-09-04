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

interface EmployeeInviteComponentProps {
	employeeName: string;
	companyName: string;
	inviterName: string;
	token: string;
	expiresAt: Date;
	acceptInviteUrl: string;
}

const EmployeeInviteComponent = ({
	employeeName,
	companyName,
	inviterName,
	token,
	expiresAt,
	acceptInviteUrl,
}: EmployeeInviteComponentProps) => {
	const formatDate = (date: Date) => {
		return date.toLocaleDateString("pt-BR", {
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	return (
		<Html lang="pt-BR">
			<Tailwind>
				<Head>
					<title>Convite para ser funcionário - PetSpot</title>
				</Head>
				<Preview>
					Você foi convidado para fazer parte da equipe da {companyName} no PetSpot! 🎉
				</Preview>
				<Body className="bg-[#f6f9fc] font-sans py-[40px]">
					<Container className="bg-white rounded-[8px] mx-auto p-[20px] max-w-[600px]">
						{/* Header */}
						<Section className="mt-[32px]">
							<Heading className="text-[28px] font-bold text-center text-[#512DA8] m-0">
								Convite para Funcionário 🎉
							</Heading>
							<Text className="text-[16px] text-center text-gray-600 mt-[16px] mb-[32px]">
								Você foi convidado para fazer parte de uma equipe incrível!
							</Text>
						</Section>

						{/* Main Content */}
						<Section className="bg-[#F9F5FF] rounded-[8px] p-[24px] mb-[32px]">
							<Text className="text-[18px] font-medium text-[#512DA8] m-0 mb-[16px]">
								Olá, {employeeName}!
							</Text>
							<Text className="text-[16px] text-gray-700 m-0 mb-[16px]">
								Temos uma ótima notícia! <strong>{inviterName}</strong> convidou você para fazer parte da equipe da <strong>{companyName}</strong> no PetSpot.
							</Text>
							<Text className="text-[16px] text-gray-700 m-0 mb-[24px]">
								Ao aceitar este convite, você terá acesso ao sistema de gestão da empresa e poderá ajudar a oferecer os melhores serviços para os pets da região.
							</Text>

							{/* Company Info Box */}
							<Section className="bg-white rounded-[8px] p-[20px] border-l-[4px] border-[#7E57C2] mb-[24px]">
								<Text className="text-[16px] font-medium text-[#512DA8] m-0 mb-[8px]">
									📋 Detalhes do Convite
								</Text>
								<Row className="mb-[8px]">
									<Column className="w-[120px]">
										<Text className="text-[14px] text-gray-600 m-0 font-medium">
											Empresa:
										</Text>
									</Column>
									<Column>
										<Text className="text-[14px] text-gray-800 m-0">
											{companyName}
										</Text>
									</Column>
								</Row>
								<Row className="mb-[8px]">
									<Column className="w-[120px]">
										<Text className="text-[14px] text-gray-600 m-0 font-medium">
											Convidado por:
										</Text>
									</Column>
									<Column>
										<Text className="text-[14px] text-gray-800 m-0">
											{inviterName}
										</Text>
									</Column>
								</Row>
								<Row>
									<Column className="w-[120px]">
										<Text className="text-[14px] text-gray-600 m-0 font-medium">
											Válido até:
										</Text>
									</Column>
									<Column>
										<Text className="text-[14px] text-gray-800 m-0">
											{formatDate(expiresAt)}
										</Text>
									</Column>
								</Row>
							</Section>

							{/* Benefits Section */}
							<Heading className="text-[18px] font-bold text-[#512DA8] m-0 mb-[16px]">
								Como funcionário, você poderá:
							</Heading>

							<Row className="mb-[12px]">
								<Column>
									<Text className="text-[14px] text-gray-700 m-0">
										✅ Gerenciar agendamentos e serviços
									</Text>
								</Column>
							</Row>
							<Row className="mb-[12px]">
								<Column>
									<Text className="text-[14px] text-gray-700 m-0">
										✅ Acompanhar o histórico de clientes
									</Text>
								</Column>
							</Row>
							<Row className="mb-[12px]">
								<Column>
									<Text className="text-[14px] text-gray-700 m-0">
										✅ Acessar relatórios e estatísticas
									</Text>
								</Column>
							</Row>
							<Row className="mb-[20px]">
								<Column>
									<Text className="text-[14px] text-gray-700 m-0">
										✅ Fazer parte de uma equipe profissional
									</Text>
								</Column>
							</Row>
						</Section>

						{/* CTA Button */}
						<Section className="text-center mb-[32px]">
							<Button
								className="bg-[#512DA8] text-white font-bold py-[16px] px-[32px] rounded-[8px] no-underline text-[18px] box-border"
								href={acceptInviteUrl}
							>
								Aceitar Convite
							</Button>
							<Text className="text-[12px] text-gray-500 mt-[12px] m-0">
								Token do convite: <code className="bg-gray-100 px-[4px] py-[2px] rounded text-[11px]">{token}</code>
							</Text>
						</Section>

						{/* Important Notice */}
						<Section className="bg-[#FFF3E0] border border-[#FFB74D] rounded-[8px] p-[16px] mb-[32px]">
							<Text className="text-[14px] text-[#F57C00] m-0 font-medium mb-[8px]">
								⚠️ Importante
							</Text>
							<Text className="text-[14px] text-gray-700 m-0 mb-[8px]">
								Este convite expira em <strong>{formatDate(expiresAt)}</strong>. Após esta data, será necessário solicitar um novo convite.
							</Text>
							<Text className="text-[14px] text-gray-700 m-0">
								Se você não reconhece este convite ou não deseja fazer parte da equipe, pode ignorar este email.
							</Text>
						</Section>

						{/* Footer */}
						<Section className="border-t border-gray-200 pt-[24px]">
							<Text className="text-[14px] text-center text-gray-500 m-0 mb-[8px]">
								Tem dúvidas? Entre em contato conosco pelo suporte
							</Text>
							<Text className="text-[14px] text-center text-gray-500 m-0 mb-[16px]">
								📧 suporte@petspot.com.br | 📞 (11) 9999-9999
							</Text>
							<Text className="text-[12px] text-center text-gray-400 m-0">
								© {new Date().getFullYear()} PetSpot. Todos os direitos reservados.
							</Text>
							<Text className="text-[12px] text-center text-gray-400 m-0">
								Av. Paulista, 1000 - São Paulo, SP
							</Text>
							<Text className="text-[12px] text-center text-gray-400 m-0 mt-[8px]">
								<a
									href="https://petspot.com.br/privacy"
									className="text-gray-400"
								>
									Política de Privacidade
								</a>
								{" • "}
								<a
									href="https://petspot.com.br/terms"
									className="text-gray-400"
								>
									Termos de Uso
								</a>
							</Text>
						</Section>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
};

export default EmployeeInviteComponent;
