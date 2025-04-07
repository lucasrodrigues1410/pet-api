import { Entity } from "@/core/domain/entities/entity";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";

export interface CompanyAvailabilityExceptionProps {
	companyId: string;
	startDate: Date;
	endDate: Date;
	reason?: string;
}

export class CompanyAvailabilityException extends Entity<CompanyAvailabilityExceptionProps> {
	get companyId() {
		return this.props.companyId;
	}

	get startDate() {
		return this.props.startDate;
	}

	get endDate() {
		return this.props.endDate;
	}

	get reason() {
		return this.props.reason;
	}

	static create(
		props: CompanyAvailabilityExceptionProps,
		id?: UniqueEntityID,
	): CompanyAvailabilityException {
		const companyAvailabilityException = new CompanyAvailabilityException(
			props,
			id,
		);
		return companyAvailabilityException;
	}
}
