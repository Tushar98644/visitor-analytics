import redis from '@/config/redisClient';

interface StreamResponse {
  name: string;
  messages: Array<{
    id: string;
    message: Record<string, string>;
  }>;
}

interface StreamEvent {
  [key: string]: string;
}

export async function consumeEvents(callback: (event: StreamEvent) => void): Promise<void> {
  let lastId = '$';
  
  while (true) {
    const response = await redis.xRead(
      [{ key: 'visitor-events', id: lastId }],
      { BLOCK: 0 }
    ) as StreamResponse[] | null;
    
    if (response) {
      for (const stream of response) {
        for (const message of stream.messages) {
          lastId = message.id;
          callback(message.message as StreamEvent);
        }
      }
    }
  }
}