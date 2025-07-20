import { Router } from 'express';
import EventController from './controller/EventController';
import SummaryController from './controller/SummaryController';

const router = Router();
const eventController = new EventController();
const summaryController = new SummaryController();

router.post('/events', (req, res) => eventController.ingest(req, res));
router.get('/analytics/summary', (req, res) => summaryController.getSummary(req, res));

export default router;
