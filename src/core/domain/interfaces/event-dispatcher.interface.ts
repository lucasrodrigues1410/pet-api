export abstract class DomainEvent {
	abstract readonly eventType: string;
}

export abstract class EventDispatcher {
	abstract dispatch(event: DomainEvent): Promise<void>;
}
