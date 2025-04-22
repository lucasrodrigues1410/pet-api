import { ISendMailOptions } from "@nestjs-modules/mailer";
import { beforeEach, describe, expect, it } from "bun:test";
import { IEmailService } from "../../domain/interfaces/i-email-service";
import { ITemplateRenderer } from "../../domain/interfaces/i-template-render.interface";
import { SendEmailUseCase } from "./send-email.use-case";


describe("SendEmailUseCase", () => {
  let renderer: ITemplateRenderer;
  let emailService: IEmailService;
  let sut: SendEmailUseCase;

  // auxiliares para capturar chamadas
  let renderCalledWith: { key: any; vars: any } | null;
  let sendMailCalledWith: ISendMailOptions | null;

  beforeEach(() => {
    renderCalledWith = null;
    sendMailCalledWith = null;

    renderer = {
      render: async (key, vars) => {
        renderCalledWith = { key, vars };
        return {
          subject: "Assunto de Teste",
          html: "<p>Corpo de teste</p>",
        };
      },
    };

    emailService = {
      sendMail: async (options) => {
        sendMailCalledWith = options;
      },
    };

    sut = new SendEmailUseCase(renderer, emailService);
  });

  it("deve renderizar o template e enviar o e‑mail com as opções corretas", async () => {
    const templateKey = "welcome";
    const to = "user@example.com";
    const variables = { name: "Usuário" };

    await sut.execute(templateKey, to, variables);

    // verifico se o renderer foi chamado com os parâmetros corretos
    expect(renderCalledWith).toBeTruthy();
    expect(renderCalledWith?.key).toBe(templateKey);
    expect(renderCalledWith?.vars).toBe(variables);

    // verifico se o emailService foi chamado com o mailOptions correto
    expect(sendMailCalledWith).toEqual({
      to,
      subject: "Assunto de Teste",
      html: "<p>Corpo de teste</p>",
    });
  });

  it("deve propagar erro quando o renderer falhar", async () => {
    // sobrescrevo apenas o renderer para lançar erro
    renderer = {
      render: async () => {
        throw new Error("Falha no render");
      },
    } as ITemplateRenderer;

    sut = new SendEmailUseCase(renderer, emailService);

    await expect(sut.execute("key", "a@b.com", {})).rejects.toThrow("Falha no render");
  });

  it("deve propagar erro quando o emailService falhar", async () => {
    // sobrescrevo apenas o emailService para lançar erro
    emailService = {
      sendMail: async () => {
        throw new Error("Falha ao enviar e‑mail");
      },
    } as IEmailService;

    sut = new SendEmailUseCase(renderer, emailService);

    await expect(sut.execute("key", "a@b.com", {})).rejects.toThrow("Falha ao enviar e‑mail");
  });
});
