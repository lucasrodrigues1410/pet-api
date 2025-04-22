import { TemplateVariablesMap } from '../template-variables';

export interface ITemplateRenderer {
  render<T extends keyof TemplateVariablesMap>(
    templateKey: T,
    variables: TemplateVariablesMap[T],
  ): Promise<{ subject: string; html: string }>;
}