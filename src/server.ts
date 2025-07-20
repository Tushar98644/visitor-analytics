import express, { type Request, type Response } from 'express'
import analyticsRoutes from './modules/analytics/routes';
import 'dotenv/config'
import { connectRedis } from '@/config/redisClient';

const app = express();

app.use(express.json());

app.get('/health', (_: Request, res: Response) => res.send('OK'));
app.use('/api', analyticsRoutes);

const PORT = process.env.PORT || 3000;

async function startServer() {
    await connectRedis();
    app.listen(PORT, () => console.log(`API up on ${PORT}`));
}

startServer();