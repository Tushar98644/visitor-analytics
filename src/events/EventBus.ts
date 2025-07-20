import { EventEmitter } from 'events';
import { VisitorEvent } from '@/modules/analytics/dto/VisitorEvent';

export interface EventBusMessage {
  type: string;
  data: any;
  timestamp: Date;
}

class EventBus extends EventEmitter {
  publishEvent(event: VisitorEvent) {
    this.emit('new_visitor_event', {
      type: 'visitor_event',
      data: event,
      timestamp: new Date()
    });
  }

  publishUserConnection(userId: string, totalConnected: number) {
    this.emit('user_connection_changed', {
      type: 'user_connected',
      data: { userId, totalConnected },
      timestamp: new Date()
    });
  }

  publishUserDisconnection(userId: string, totalConnected: number) {
    this.emit('user_connection_changed', {
      type: 'user_disconnected', 
      data: { userId, totalConnected },
      timestamp: new Date()
    });
  }

  publishVisitorUpdate(summary: any) {
  this.emit('visitor_update', {
    type: 'visitor_update',
     summary,
    timestamp: new Date()
  });
}
}

export const eventBus = new EventBus();