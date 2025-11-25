import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { addHours } from "date-fns";
import { AppointmentReminderEvent } from "@/modules/notification/domain/events/appointment-reminder.event";
import { AppointmentRepository } from "../../domain/repositories/appointment.repository";
import { NotificationPublisher } from "@/modules/notification/domain/interfaces/notification-publisher.interface";

@Injectable()
export class AppointmentReminderJob {
	private readonly logger = new Logger(AppointmentReminderJob.name);

	constructor(
		private readonly appointmentRepository: AppointmentRepository,
		private readonly notifyPublisher: NotificationPublisher,
	) {}

	@Cron(CronExpression.EVERY_HOUR)
	async handleCron() {
		this.logger.log("Running appointment reminder job");

		const now = new Date();
		const nextHour = addHours(now, 1);
		const next24Hours = addHours(now, 24);
		const next25Hours = addHours(now, 25);

		// Reminder for appointments in 1 hour
		await this.processReminders(now, nextHour, "1h");

		// Reminder for appointments in 24 hours
		await this.processReminders(next24Hours, next25Hours, "24h");
	}

	private async processReminders(start: Date, end: Date, type: string) {
		const appointments =
			await this.appointmentRepository.findUpcomingAppointments({
				startDate: start,
				endDate: end,
			});

		this.logger.log(
			`Found ${appointments.length} appointments for ${type} reminder`,
		);

		for (const appointment of appointments) {
			const event = new AppointmentReminderEvent(
				appointment.client.id.toString(),
				appointment.client.email,
				{
					clientName: appointment.client.name,
					companyName: appointment.company.name,
					date: appointment.startDate.toISOString(),
					serviceName: appointment.service.name,
					professionalName: appointment.staff.name,
				},
			);

			this.notifyPublisher.dispatch(event);
		}
	}
}
