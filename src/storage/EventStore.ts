import { VisitorEvent } from '@/modules/analytics/dto/VisitorEvent';

interface StoredEvent extends VisitorEvent {
  id: string;
  receivedAt: Date;
}

export class EventStore {
  private events: StoredEvent[] = [];
  private eventIdCounter = 1;

  addEvent(event: VisitorEvent): StoredEvent {
    const storedEvent: StoredEvent = {
      ...event,
      id: `event_${this.eventIdCounter++}`,
      receivedAt: new Date()
    };
    
    this.events.push(storedEvent);
    
    if (this.events.length > 10000) {
      this.events = this.events.slice(-5000);
    }
    
    return storedEvent;
  }

  getAllEvents(): StoredEvent[] {
    return [...this.events];
  }

  getEventsSince(timestamp: Date): StoredEvent[] {
    return this.events.filter(event => event.receivedAt > timestamp);
  }

  getEventCount(): number {
    return this.events.length;
  }

  getPageViews(): StoredEvent[] {
    return this.events.filter(event => event.type === 'pageview');
  }

  getUniqueSessions(): string[] {
    const sessions = new Set(this.events.map(event => event.sessionId));
    return Array.from(sessions);
  }

  getCountriesStats(): Record<string, number> {
    const countries: Record<string, number> = {};
    this.events.forEach(event => {
      countries[event.country] = (countries[event.country] || 0) + 1;
    });
    return countries;
  }

  getSessionEvents(sessionId: string): StoredEvent[] {
    return this.events.filter(event => event.sessionId === sessionId);
  }
}

export const eventStore = new EventStore();