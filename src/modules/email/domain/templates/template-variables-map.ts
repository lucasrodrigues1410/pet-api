import { AppointmentStatusChangedTemplateVariables } from "./appointment-change-status.template";
import { WelcomeTemplateVariables } from "./user-create.template";

export type TemplateVariablesMap = {
	welcome: WelcomeTemplateVariables;
	"appointment-status-changed": AppointmentStatusChangedTemplateVariables;
};
