import { Request, Response } from 'express';
import { VisitorEventSchema } from '../dto/VisitorEvent';

export default class EventController {
  async ingest(req: Request, res: Response) {

    const parseResult = VisitorEventSchema.safeParse(req.body);

    if (!parseResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        issues: parseResult.error.issues,
      });
    }

    res.status(202).send({ status: 'queued' });
  }
}