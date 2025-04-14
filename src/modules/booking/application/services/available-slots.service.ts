import { TimeRange } from "@/modules/company-availability/domain/entities/value-objects/time-range";
import type { DateRange } from "@/shared/types/date-range";
import { addMinutes, format, isAfter, isBefore } from "date-fns";
import { TimeSlot } from "../../domain/entities/time-slot.entity";

interface FilterParams {
	slots: Date[];
	duration: number;
	staffsData: {
		staffId: string;
		unavailablePeriods: DateRange[];
	}[];
	companyExceptions: DateRange[];
	launchTime: TimeRange;
}

export class AvailableSlotsService {
	filterAvailableSlots(params: FilterParams): TimeSlot[] {
		const { slots, duration, staffsData, companyExceptions } = params;
		const totalStaffCount = staffsData.length;

		// Validação inicial
		if (totalStaffCount === 0 || duration <= 0 || !slots.length) {
			return [];
		}

		const availableSlotsOutput: Date[] = [];

		for (const potentialSlotStart of slots) {
			const potentialSlotEnd = addMinutes(potentialSlotStart, duration);
			const slotStartTime = format(potentialSlotStart, "HH:mm");
			const slotEndTime = format(potentialSlotEnd, "HH:mm");

			// Verificar se o slot está dentro do horário de almoço
			if (
				slotStartTime < params.launchTime.endTime &&
				slotEndTime > params.launchTime.startTime
			) {
				continue;
			}

			// Verificar sobreposição com exceções da empresa
			const overlapsWithCompanyException = companyExceptions.some(
				(exception) =>
					isBefore(potentialSlotStart, exception.endDate) &&
					isAfter(potentialSlotEnd, exception.startDate),
			);

			if (overlapsWithCompanyException) {
				continue;
			}

			// Verificar se pelo menos um funcionário está disponível
			const isAnyStaffAvailable = staffsData.some((staffInfo) => {
				const isStaffBusy = staffInfo.unavailablePeriods.some(
					(period) =>
						isBefore(potentialSlotStart, period.endDate) &&
						isAfter(potentialSlotEnd, period.startDate),
				);
				return !isStaffBusy;
			});

			if (isAnyStaffAvailable) {
				availableSlotsOutput.push(potentialSlotStart);
			}
		}

		// Mapear os slots disponíveis para o formato TimeSlot
		return availableSlotsOutput.map((slot) =>
			TimeSlot.create({
				label: slot.toLocaleTimeString("pt-BR", {
					hour: "2-digit",
					minute: "2-digit",
				}),
			}),
		);
	}
}
