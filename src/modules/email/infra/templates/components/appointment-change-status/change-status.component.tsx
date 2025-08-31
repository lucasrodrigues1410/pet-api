import {
	Body,
	Button,
	Container,
	Head,
	Heading,
	Html,
	Preview,
	Section,
	Text,
} from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";
import { AppointmentStatus } from "@/modules/appointment/domain/entities/appointment.entity";

// Definindo a interface de props para o componente
interface StatusUpdateProps {
	userName: string;
	petName: string;
	serviceName: string;
	status: AppointmentStatus;
	appointmentDate: string;
	appointmentTime: string;
	providerName: string;
}

const StatusUpdateTemplateComponent = ({
	userName = "Tutor(a)",
	petName = "Seu Pet",
	serviceName = "Serviço Agendado",
	status = "confirmed",
	appointmentDate = "01/01/2025",
	appointmentTime = "14:00",
	providerName = "Pet Shop Parceiro",
}: StatusUpdateProps) => {
	// Emoji pode ser dinâmico com base no status, se desejar
	const statusEmoji = () => {
		switch (status) {
			case "confirmed":
				return "✅";
			case "canceled":
				return "🎉";
			case "in_progress":
				return "🚚";
			case "completed":
				return "❌";
			default:
				return "🔔";
		}
	};

	const statusText = () => {
		switch (status) {
			case "confirmed":
				return "confirmado";
			case "canceled":
				return "cancelado";
			case "in_progress":
				return "em andamento";
			case "completed":
				return "completo";
			default:
				return "pendente";
		}
	};

	return (
		<Html lang="pt-BR">
			<Tailwind>
				<Head>
					<title>Atualização do seu agendamento no PetSpot</title>
				</Head>
				<Preview>O status do serviço para {petName} foi atualizado!</Preview>
				<Body className="bg-[#f6f9fc] font-sans py-[40px]">
					<Container className="bg-white rounded-[8px] mx-auto p-[20px] max-w-[600px]">
						{/* Header */}
						<Section className="mt-[32px]">
							<Heading className="text-[28px] font-bold text-center text-[#512DA8] m-0">
								Agendamento {statusText()}! {statusEmoji()}
							</Heading>
							<Text className="text-[16px] text-center text-gray-600 mt-[16px] mb-[32px]">
								Temos uma novidade sobre o seu agendamento no PetSpot.
							</Text>
						</Section>

						{/* Main Content */}
						<Section className="mb-[32px]">
							<Text className="text-[18px] font-medium text-[#512DA8] m-0 mb-[16px]">
								Olá, {userName}!
							</Text>
							<Text className="text-[16px] text-gray-700 m-0 mb-[24px]">
								O status do serviço de{" "}
								<strong className="text-[#512DA8]">{serviceName}</strong> para
								o(a) <strong className="text-[#512DA8]">{petName}</strong> foi
								atualizado.
							</Text>

							{/* Detalhes do Agendamento */}
							<Section className="bg-[#F9F5FF] rounded-[8px] p-[24px]">
								<Heading
									as="h2"
									className="text-[20px] font-bold text-[#512DA8] m-0 mb-[16px]"
								>
									Detalhes do Agendamento
								</Heading>
								<Text className="text-[16px] text-gray-800 m-0 mb-[8px]">
									<strong>Serviço:</strong> {serviceName}
								</Text>
								<Text className="text-[16px] text-gray-800 m-0 mb-[8px]">
									<strong>Pet:</strong> {petName}
								</Text>
								<Text className="text-[16px] text-gray-800 m-0 mb-[8px]">
									<strong>Data:</strong> {appointmentDate}
								</Text>
								<Text className="text-[16px] text-gray-800 m-0 mb-[8px]">
									<strong>Horário:</strong> {appointmentTime}
								</Text>
								<Text className="text-[16px] text-gray-800 m-0">
									<strong>Local:</strong> {providerName}
								</Text>
							</Section>
						</Section>

						{/* CTA Button */}
						<Section className="text-center mb-[32px]">
							<Button
								className="bg-[#512DA8] text-white font-bold py-[12px] px-[24px] rounded-[8px] no-underline text-[16px] box-border"
								href={"#"}
							>
								Ver Detalhes do Agendamento
							</Button>
						</Section>

						{/* Help Section */}
						<Section className="border-t border-gray-200 pt-[24px] mb-[32px]">
							<Text className="text-[16px] text-center text-gray-700 m-0">
								Se tiver alguma dúvida, entre em contato com o estabelecimento
								ou responda a este e-mail.
							</Text>
						</Section>

						{/* Footer (Reaproveitado do template original) */}
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

export default StatusUpdateTemplateComponent;
