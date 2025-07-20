import { createClient } from 'redis';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
console.log(`Attempting to connect to Redis at ${REDIS_URL}`);

const client = createClient({ url: REDIS_URL });

client.on('error', err => console.error('🔴 Redis Client Error:', err));
client.on('connect', () => console.log('🟡 Redis “connect” event emitted'));
client.on('ready', () => console.log('🟢 Redis is READY to accept commands'));

export const connectRedis = async () => {
  try {
    if (!client.isOpen) {
      await client.connect();
      console.log('✅ connectRedis() promise resolved');
    }
  } catch (err) {
    console.error('❌ Failed to connect to Redis:', err);
    process.exit(1);
  }
};

export default client;