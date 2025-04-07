import {
	DomainEvent,
	EventDispatcher,
} from "@/core/domain/interfaces/event-dispatcher.interface";

export class MockEventDispatcher implements EventDispatcher {
	dispatch(event: DomainEvent): Promise<void> {
		return Promise.resolve();
	}
}
