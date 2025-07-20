import { Request, Response } from 'express';
import { VisitorEventSchema } from '../dto/VisitorEvent';
import redis from '@/config/redisClient';
import { serializeForRedis } from '@/modules/analytics/utils/serializeForRedis';

export default class EventController {
  async ingest(req: Request, res: Response) {

    const parseResult = VisitorEventSchema.safeParse(req.body);

    if (!parseResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        issues: parseResult.error.issues,
      });
    }

    await redis.xAdd(
      'visitor-events',
      '*',
      serializeForRedis(parseResult.data)
    );

    await redis.del('analytics:summary');

    res.status(202).send({ status: 'queued' });
  }
}