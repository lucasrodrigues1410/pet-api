import { Entity } from "@/core/domain/entities/entity";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { CompanyAvailability } from "@/modules/company-availability/domain/entities/company-availability.entity";
import { CompanyAvailabilityException } from "@/modules/company-availability/domain/entities/company-availability-exception.entity";
import { Staff } from "@/modules/staff/domain/entities/staff.entity";

export interface CompanyProps {
	name: string;
	address?: string;
	contact?: string;
	availability?: CompanyAvailability[];
	availabilityExceptions?: CompanyAvailabilityException[];
	staff?: Staff[];
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

	get staff() {
		return this.props.staff;
	}

	public static create(props: CompanyProps, id?: UniqueEntityID): Company {
		return new Company(props, id);
	}
}
