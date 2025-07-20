import redis from '@/config/redisClient'

export async function consumeEvents(callback: (event: any) => void) {
    let lastId = '$';
    while (true) {
      try {
        const response = await redis.xRead(
          [{ key: 'visitor-events', id: lastId }],
          { BLOCK: 0 }
        );
  
        if (Array.isArray(response)) {
            const streams = response;
          
            for (const stream of streams) {
              for (const { id, message } of stream.messages) {
                lastId = id;
                callback(message);
              }
            }
        }          
      } catch (error) {
        console.error('❌ Error in consumeEvents:', error);
        await new Promise((res) => setTimeout(res, 1000)); 
      }
    }
}
  