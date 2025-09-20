import { workflow } from "@novu/framework";
import { renderWelcomeTemplate } from "../templates/welcome.component";

export const userCreatedWorkflow = workflow(
	"user-created2",
	async ({ step, payload }) => {
		await step.email("send-email", async () => {
			return {
				subject: "Seja bem-vindo(a) à nossa plataforma!",
				body: await renderWelcomeTemplate({ name: payload.name }),
			};
		});
	},
	{
		payloadSchema: {
			type: "object",
			properties: { name: { type: "string" } },
			required: ["name"],
			additionalProperties: false,
		} as const,
	},
);
