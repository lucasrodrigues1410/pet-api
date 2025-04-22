import { Injectable } from '@nestjs/common';
import { TemplateVariablesMap } from '../../domain/template-variables';
import { render } from '@react-email/render';
import { templatesRegistration } from './templates-registration';
import type { ITemplateRenderer } from '../../domain/interfaces/i-template-render.interface';

type TemplateKey = keyof typeof templatesRegistration;

@Injectable()
export class ReactEmailTemplateRenderer implements ITemplateRenderer {
  async render<T extends TemplateKey>(
    templateKey: T,
    variables: TemplateVariablesMap[T],
  ): Promise<{ subject: string; html: string }> {
    const { component: Component, subject } = templatesRegistration[templateKey];
    const html = await render(<Component {...(variables as any)} />, {
      pretty: process.env.NODE_ENV !== 'production',
    });
    return { subject, html };
  }
}