import { Module } from "@nestjs/common";
import { AnimalModule } from "../animal/animal.module";
import { AppointmentModule } from "../appointment/appointment.module";
import { BreedModule } from "../breed/breed.module";
import { CompanyAvailabilityModule } from "../company-availability/company-availability.module";
import { PriceVariationModule } from "../price-variation/price-variation.module";
import { ServiceModule } from "../service/service.module";
import { StaffModule } from "../staff/staff.module";
import { UserModule } from "../user/user.module";
import { AppointmentAvailabilityService } from "./application/services/appointment-availability.service";
import { AppointmentBookingUseCase } from "./application/use-cases/appointment-booking.use-case";
import { ListAvailableDatesUseCase } from "./application/use-cases/list-available-dates.use-case";
import { BookingController } from "./infra/http/controllers/booking.controller";

@Module({
	imports: [
		AppointmentModule,
		CompanyAvailabilityModule,
		ServiceModule,
		PriceVariationModule,
		StaffModule,
		AnimalModule,
		UserModule,
		BreedModule,
	],
	controllers: [BookingController],
	providers: [
		AppointmentAvailabilityService,
		AppointmentBookingUseCase,
		ListAvailableDatesUseCase,
	],
})
export class BookingModule {}
