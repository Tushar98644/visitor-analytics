import { Router } from 'express';
import EventController from '@/modules/analytics/controller/EventController';

const router = Router();
const controller = new EventController();

router.post('/events', (req, res) => controller.ingest(req, res));

export default router;