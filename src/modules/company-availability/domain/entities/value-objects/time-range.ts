import { ValueObject } from "@/core/entities/value-object";

interface TimeRangeProps {
	startTime: string;
	endTime: string;
}

export class TimeRange extends ValueObject<TimeRangeProps> {
	constructor(props: TimeRangeProps) {
		const { startTime, endTime } = props;
		const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
		if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
			throw new Error("Formato de hora inválido. Use HH:mm.");
		}

		const [startHours, startMinutes] = startTime.split(":").map(Number);
		const [endHours, endMinutes] = endTime.split(":").map(Number);

		if (
			endHours < startHours ||
			(endHours === startHours && endMinutes <= startMinutes)
		) {
			throw new Error("O horário de início deve ser anterior ao fim.");
		}

		super(props);
	}

	get startTime() {
		return this.props.startTime;
	}

	get endTime() {
		return this.props.endTime;
	}
}
