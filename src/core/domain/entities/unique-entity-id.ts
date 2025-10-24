import { randomUUIDv7 } from "bun";

export class UniqueEntityID {
	private value: string;

	toString() {
		return this.value;
	}

	toValue() {
		return this.value;
	}

	constructor(value?: string) {
		this.value = value ?? randomUUIDv7();
	}

	public equals(id: UniqueEntityID | string) {
		return id instanceof UniqueEntityID
			? id.toValue() === this.value
			: id === this.value;
	}
}
