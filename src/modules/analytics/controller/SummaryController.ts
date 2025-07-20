import { Request, Response } from 'express';
import AnalyticsService from '@/modules/analytics/services/AnalyticsService';

export default class SummaryController {
  private analyticsService = new AnalyticsService();

  async getSummary(req: Request, res: Response) {
    try {
      const summary = await this.analyticsService.getSummary();
      res.json(summary);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch analytics summary' });
    }
  }
}