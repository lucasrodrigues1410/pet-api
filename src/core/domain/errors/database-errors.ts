export class DatabaseError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "DatabaseError";
	}
}

export class ConflictError extends DatabaseError {
	constructor(message: string) {
		super(message);
		this.name = "ConflictError";
	}
}

export class NotFoundError extends DatabaseError {
	constructor(message: string) {
		super(message);
		this.name = "NotFoundError";
	}
}
