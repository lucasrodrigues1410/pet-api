export abstract class DomainEvent {
	constructor(public readonly type: string) {}
}

export abstract class EventDispatcher {
	abstract dispatch(event: DomainEvent): Promise<void>;
}
