import { Entity } from "@/core/domain/entities/entity";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";

export interface LocationProps {
	addressLine: string;
    number: string;
    complement: string | null;
    neighborhood: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    latitude: number;
    longitude: number;
}

export class Location extends Entity<LocationProps> {
    get addressLine() {
        return this.props.addressLine;
    }

    get number() {
        return this.props.number;
    }
    
    get complement() {
        return this.props.complement;
    }

    get neighborhood() {
        return this.props.neighborhood;
    }
    
    get city() {
        return this.props.city;
    }

    get state() {
        return this.props.state;
    }
    
    get country() {
        return this.props.country;
    }

    get postalCode() {
        return this.props.postalCode;
    }
    
    get latitude() {
        return this.props.latitude;
    }

    get longitude() {
        return this.props.longitude;
    }
    
        
    public static create(props: LocationProps, id?: UniqueEntityID): Location {
        return new Location(props, id);
    }

    public toObject() {
        return {
            id: this.id.toString(),
            addressLine: this.addressLine,
            number: this.number,
            complement: this.complement,
            neighborhood: this.neighborhood,
            city: this.city,
            state: this.state,
            country: this.country,
            postalCode: this.postalCode,
            latitude: this.latitude,
            longitude: this.longitude,
        };
    }
}