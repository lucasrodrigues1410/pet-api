import { Module } from "@nestjs/common";
import { CalculateUnavailableSlotsUseCase } from "./application/use-cases/calculate-unavailable-slots.use-case";
import { AppointmentModule } from "../appointment/appointment-availability.module";

@Module({
	imports: [AppointmentModule],
	providers: [CalculateUnavailableSlotsUseCase],
})
export class AvailabilityModule {}
