import { EventDispatcher } from "@/core/domain/interfaces/event-dispatcher.interface";

export class MockEventDispatcher implements EventDispatcher {
	dispatch(): Promise<void> {
		return Promise.resolve();
	}
}
