import { Request, Response } from 'express';
import { VisitorEventSchema } from '@/modules/analytics/dto/VisitorEvent';
import { eventStore } from '../../../storage/EventStore';
import { eventBus } from '../../../events/EventBus';
import AnalyticsService from '@/modules/analytics/services/AnalyticsService';

export default class EventController {
  private analyticsService = new AnalyticsService();

  async ingest(req: Request, res: Response) {
    const parseResult = VisitorEventSchema.safeParse(req.body);
    
    if (!parseResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        issues: parseResult.error.issues,
      });
    }

    const storedEvent = eventStore.addEvent(parseResult.data);
    
    this.analyticsService.invalidateCache();
    
    eventBus.publishEvent(parseResult.data);
    
    const summary = this.analyticsService.getSummary();
    eventBus.publishVisitorUpdate(summary);
    
    res.status(202).json({ 
      status: 'accepted',
      eventId: storedEvent.id 
    });
  }
}