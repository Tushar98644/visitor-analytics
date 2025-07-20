import { Router } from 'express';
import EventController from './controller/EventController';
import AnalyticsService from './services/AnalyticsService';

const router = Router();
const eventController = new EventController();
const analyticsService = new AnalyticsService();

router.post('/events', (req, res) => eventController.ingest(req, res));

router.get('/analytics/summary', (req, res) => {
  try {
    const summary = analyticsService.getSummary();
    res.json(summary);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch analytics summary' });
  }
});

router.get('/analytics/sessions', (req, res) => {
  try {
    const sessions = analyticsService.getSessionsData();
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

export default router;