import type { Request, Response } from 'express';
import type { VisitorEvent } from '../dto/VisitorEvent';

export default class EventController {
  // Controller keeps *no* shared state; statelessness aids horizontal scaling[7].
  async ingest(req: Request<{}, {}, VisitorEvent>, res: Response) {
    // TODO: validate & publish to message bus
    res.status(202).send({ status: 'queued' });
  }
}
