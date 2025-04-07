export interface DomainEvent {
	name: string;
}

export abstract class EventDispatcher {
	abstract dispatch(event: DomainEvent): Promise<void>;
}
