import { createClient } from 'redis';

const client = createClient();

client.on('error', (err) => {
  console.error('Redis Client Error:', err);
});

export const connectRedis = async() => {
  try {
    if (!client.isOpen) {
      await client.connect();
      console.log('✅ Redis connected');
    }
  } catch (err) {
    console.error('❌ Failed to connect to Redis:', err);
  }
}

export default client;