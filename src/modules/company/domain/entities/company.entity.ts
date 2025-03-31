import { CompanyAvailabilityException } from "@/modules/company-availability/domain/entities/company-availability-exception.entity";
import { CompanyAvailability } from "@/modules/company-availability/domain/entities/company-availability.entity";
import { Entity } from "src/core/entities/entity";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";

export interface CompanyProps {
	name: string;
	address?: string;
	contact?: string;
	availability?: CompanyAvailability[];
	availabilityExceptions?: CompanyAvailabilityException[];
}

export class Company extends Entity<CompanyProps> {
	get name() {
		return this.props.name;
	}

	get address() {
		return this.props.address;
	}

	get contact() {
		return this.props.contact;
	}

	get availability() {
		return this.props.availability;
	}

	get availabilityExceptions() {
		return this.props.availabilityExceptions;
	}

	public static create(props: CompanyProps, id?: UniqueEntityID): Company {
		return new Company(props, id);
	}
}
